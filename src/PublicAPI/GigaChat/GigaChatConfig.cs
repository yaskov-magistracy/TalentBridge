using Infrastructure;

namespace GigaChat;

public class GigaChatConfig
{
    public string AuthorizationKey { get; set; } = ConfigReader.GetVar<string>("GIGACHAD_AUTHORIZATION_KEY");
    public GigaChatScope Scope { get; set; } = ConfigReader.GetVar<GigaChatScope>("GIGACHAD_SCOPE");
}