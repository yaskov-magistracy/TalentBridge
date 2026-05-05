namespace GigaChad.Completions.Response;

public class GigaChadCompletionsResponse
{
    public GigaChadCompletionsResponseChoice[] Choices { get; set; }
    public long Created { get; set; }
}