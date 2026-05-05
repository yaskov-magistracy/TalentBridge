using System.Text.Json.Serialization;

namespace GigaChad;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum GigaChadScope
{
    PERS,
    B2B,
    CORP,
}