using Infrastructure;

namespace GigaChad;

public class GigaChadConfig
{
    public string AuthorizationKey { get; set; } = ConfigReader.GetVar<string>("GIGACHAD_AUTHORIZATION_KEY");
    public GigaChadScope Scope { get; set; } = ConfigReader.GetVar<GigaChadScope>("GIGACHAD_SCOPE");
}