using System.Text.Json.Serialization;

namespace GigaChad.Oauth;

internal class GigaChadOauthResponse
{
    [JsonPropertyName("access_token")]
    public string AccessToken { get; set; }
    [JsonPropertyName("expires_at")]
    public long ExpiresAt { get; set; }
}