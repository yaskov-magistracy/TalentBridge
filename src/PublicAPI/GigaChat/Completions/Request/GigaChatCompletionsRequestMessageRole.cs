using GigaChat.Infrastructure;

namespace GigaChat.Completions.Request;

[Newtonsoft.Json.JsonConverter(typeof(LowerCaseStringEnumConverter))]
public enum GigaChatCompletionsRequestMessageRole
{
    System, // Системный промпт
    Assistant, // Ответ ИИ
    User, // Ответ пользователя
    Function
}