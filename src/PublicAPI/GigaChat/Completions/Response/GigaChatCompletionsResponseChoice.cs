using System.Text.Json.Serialization;

namespace GigaChat.Completions.Response;

public class GigaChatCompletionsResponseChoice
{
    public GigaChatCompletionsResponseChoiceMessage Message { get; set; }
    public int Index { get; set; }
    [JsonPropertyName("finish_reason")]
    public string FinishReason { get; set; }
}