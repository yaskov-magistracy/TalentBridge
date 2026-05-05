using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using GigaChat.Completions.Request;
using GigaChat.Completions.Response;
using GigaChat.Files.Response;
using GigaChat.Oauth;
using Newtonsoft.Json;

namespace GigaChat;

public interface IGigaChatClient
{
    Task<GigaChatCompletionsResponse> Completions(GigaChatCompletionsRequest request);
    Task<GigaChatGetFilesResponse> GetFiles();
    Task<GigaChatFileItem> GetFile(Guid fileId);
    Task<GigaChatFileItem> UploadFile(Stream fileStream, string fileName, string purpose = "general");
    Task<GigaChatFileItem> DeleteFile(Guid fileId);
}

public class GigaChatClient(
    GigaChatConfig config
) : IGigaChatClient
{
    private readonly GigaChatOauthProvider oauthProvider = new(config.AuthorizationKey, config.Scope);
    private readonly HttpClient httpClient = new();
    private const string Model = "GigaChat-2";
    private const string BaseUrl = "https://gigachat.devices.sberbank.ru/api/v1";

    public async Task<GigaChatCompletionsResponse> Completions(GigaChatCompletionsRequest request)
        => await Post<GigaChatCompletionsResponse>(
            "/chat/completions", 
            new StringContent(JsonConvert.SerializeObject(request), Encoding.UTF8, "application/json"));

    public async Task<GigaChatGetFilesResponse> GetFiles()
        => await Get<GigaChatGetFilesResponse>("/files");

    public async Task<GigaChatFileItem> GetFile(Guid fileId)
        => await Get<GigaChatFileItem>($"/files/{fileId}");

    public async Task<GigaChatFileItem> UploadFile(Stream fileStream, string fileName, string purpose = "general")
    {
        var content = new MultipartFormDataContent();
        
        var fileContent = new StreamContent(fileStream);
        fileContent.Headers.ContentType = new MediaTypeHeaderValue(GetMimeType(fileName));
        content.Add(fileContent, "file", fileName);
        content.Add(new StringContent(purpose), "purpose");
        
        return await Post<GigaChatFileItem>("/files", content);
    }

    private static string GetMimeType(string fileName)
    {
        var extension = Path.GetExtension(fileName).ToLowerInvariant();
        return extension switch
        {
            ".jpg" or ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            ".gif" => "image/gif",
            ".webp" => "image/webp",
            ".pdf" => "application/pdf",
            ".doc" => "application/msword",
            ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ".xls" => "application/vnd.ms-excel",
            ".xlsx" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            ".txt" => "text/plain",
            ".mp3" => "audio/mpeg",
            ".wav" => "audio/wav",
            ".ogg" => "audio/ogg",
            _ => "application/octet-stream"
        };
    }

    public async Task<GigaChatFileItem> DeleteFile(Guid fileId)
        => await Post<GigaChatFileItem>($"/files/{fileId}/delete", null);

    
    private Task<T> Get<T>(string urlPostfix)
        => SendRequest<T>(HttpMethod.Get, urlPostfix);

    private Task<T> Post<T>(string urlPostfix, HttpContent? content)
        => SendRequest<T>(HttpMethod.Post, urlPostfix, content);

    private async Task<TResponse> SendRequest<TResponse>(
        HttpMethod method,
        string urlPostfix,
        HttpContent? body = null)
    {
        var accessToken = await oauthProvider.GetAccessToken();
        var request = new HttpRequestMessage(method, $"{BaseUrl}{urlPostfix}");
        request.Headers.Add("Authorization", $"Bearer {accessToken}");
        request.Headers.Add("Accept", "application/json");
        request.Content = body;
        
        var response = await httpClient.SendAsync(request);
        if (!response.IsSuccessStatusCode)
        {
            var errorBody = await response.Content.ReadAsStringAsync();
            throw new HttpRequestException(
                $"GigaChat API error. Code: {response.StatusCode}. Body: {errorBody}");
        }
        var result = await response.Content.ReadFromJsonAsync<TResponse>();
        if (result is null)
            throw new Exception($"Invalid response. Url: {urlPostfix}");
        
        return result;
    }
}