using System.Text.Json.Serialization;

namespace GigaChat;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum GigaChatScope
{
    PERS,
    B2B,
    CORP,
}