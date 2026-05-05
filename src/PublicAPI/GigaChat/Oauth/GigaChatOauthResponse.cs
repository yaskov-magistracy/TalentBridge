using System.Text.Json.Serialization;

namespace GigaChat.Oauth;

internal class GigaChatOauthResponse
{
    [JsonPropertyName("access_token")]
    public string AccessToken { get; set; }
    [JsonPropertyName("expires_at")]
    public long ExpiresAt { get; set; }
}