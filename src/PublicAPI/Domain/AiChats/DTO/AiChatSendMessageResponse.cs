namespace Domain.AiChats.DTO;

public record AiChatSendMessageResponse(
    AiChatMessage UserRequest,
    AiChatMessage AiResponse)
{
    
}