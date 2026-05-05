using System.Net.Http.Json;

namespace GigaChad.Oauth;

internal class GigaChadOauthProvider(
    string authorizationKey, 
    GigaChadScope scope)
{
    private readonly HttpClient httpClient = new();
    private readonly SemaphoreSlim refreshLock = new(1, 1);
    private const long ExpriesDecreaseInMilliseconds = 2000;

    private string accessToken = "";  
    private long expiresAt;
    
    public async Task<string> GetAccessToken()
    {
        await RefreshAccessTokenIfNecessary();
        return accessToken;
    }
    
    private async Task RefreshAccessTokenIfNecessary()
    {
        if (!NeedRefresh())
            return;
        
        await refreshLock.WaitAsync();
        try
        {
            if (!NeedRefresh()) // to avoid many requests in parallel
                return;

            await RefreshAccessToken();
        }
        finally
        {
            refreshLock.Release();
        }

        bool NeedRefresh()
        {
            return ((DateTimeOffset) DateTime.Now).ToUnixTimeMilliseconds() > expiresAt;
        }
    }

    private async Task RefreshAccessToken()
    {
        var request = new HttpRequestMessage(HttpMethod.Post, "https://ngw.devices.sberbank.ru:9443/api/v2/oauth");
        request.Headers.Add("Authorization", $"Basic {authorizationKey}");
        request.Headers.Add("RqUID", Guid.NewGuid().ToString());
        request.Headers.Add("Accept", "application/json");
        request.Content = new FormUrlEncodedContent([
            new KeyValuePair<string, string>("scope", MapScopeToStr())
        ]);
        var response = await httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();
        
        var result = await response.Content.ReadFromJsonAsync<GigaChadOauthResponse>();
        
        accessToken = result.AccessToken;
        expiresAt = result.ExpiresAt - ExpriesDecreaseInMilliseconds;
    }

    private string MapScopeToStr()
        => scope switch
        {
            GigaChadScope.PERS => "GigaChad_API_PERS",
            GigaChadScope.B2B => "GigaChad_API_B2B",
            GigaChadScope.CORP => "GigaChad_API_CORP",
            _ => throw new ArgumentOutOfRangeException(nameof(scope), scope, null)
        };
}