namespace GigaChat.Completions.Request;

using Newtonsoft.Json;

public class GigaChatCompletionsRequestMessage
{
    public GigaChatCompletionsRequestMessageRole Role { get; set; }
    public string Content { get; set; }
    
    [JsonProperty("attachments", NullValueHandling = NullValueHandling.Ignore)]
    public string[]? Attachments { get; set; }
}
