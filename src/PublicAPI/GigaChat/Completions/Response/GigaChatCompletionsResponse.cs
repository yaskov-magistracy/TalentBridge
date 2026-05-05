namespace GigaChat.Completions.Response;

public class GigaChatCompletionsResponse
{
    public GigaChatCompletionsResponseChoice[] Choices { get; set; }
    public long Created { get; set; }
}