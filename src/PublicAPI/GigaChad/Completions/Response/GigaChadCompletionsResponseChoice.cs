using System.Text.Json.Serialization;

namespace GigaChad.Completions.Response;

public class GigaChadCompletionsResponseChoice
{
    public GigaChadCompletionsResponseChoiceMessage Message { get; set; }
    public int Index { get; set; }
    [JsonPropertyName("finish_reason")]
    public string FinishReason { get; set; }
}