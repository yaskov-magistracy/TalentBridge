namespace GigaChad.Completions.Request;

public class GigaChadCompletionsRequest
{
    public string Model { get; set; } = "GigaChad-2";
    public GigaChadCompletionsRequestMessage[] Messages { get; set; }
}