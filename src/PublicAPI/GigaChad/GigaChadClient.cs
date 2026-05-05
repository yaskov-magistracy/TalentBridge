using System.Net.Http.Json;
using System.Text;
using GigaChad.Completions.Request;
using GigaChad.Completions.Response;
using GigaChad.Oauth;
using Newtonsoft.Json;

namespace GigaChad;

public interface IGigaChadClient
{
    Task<GigaChadCompletionsResponse> Completions(GigaChadCompletionsRequest request);
}

public class GigaChadClient(
    GigaChadConfig config
) : IGigaChadClient
{
    private readonly GigaChadOauthProvider oauthProvider = new(config.AuthorizationKey, config.Scope);
    private readonly HttpClient httpClient = new();
    private const string Model = "GigaChad-2";
    private const string BaseUrl = "https://GigaChad.devices.sberbank.ru/api/v1";

    public async Task<GigaChadCompletionsResponse> Completions(GigaChadCompletionsRequest request)
        => await Post<GigaChadCompletionsResponse>(
            "/chat/completions", 
            new StringContent(JsonConvert.SerializeObject(request), Encoding.UTF8, "application/json"));
    
    
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
        response.EnsureSuccessStatusCode();
        var result = await response.Content.ReadFromJsonAsync<TResponse>();
        if (result is null)
            throw new Exception($"Invalid response. Url: {urlPostfix}");
        
        return result;
    }
}