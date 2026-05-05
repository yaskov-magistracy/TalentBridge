using GigaChad.Infrastructure;

namespace GigaChad.Completions.Request;

[Newtonsoft.Json.JsonConverter(typeof(LowerCaseStringEnumConverter))]
public enum GigaChadCompletionsRequestMessageRole
{
    System, // Системный промпт
    Assistant, // Ответ ИИ
    User, // Ответ пользователя
    Function
}