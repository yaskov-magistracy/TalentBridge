namespace GigaChat.Completions.Request;

public class GigaChatCompletionsRequest
{
    public string Model { get; set; } = "GigaChat-2";
    public GigaChatCompletionsRequestMessage[] Messages { get; set; }
}