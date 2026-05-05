namespace Domain.AiChats.DTO;

public record AiChatMessageCreateEntity(
    Guid ChatId,
    string Text,
    AiChatMessageAuthor Author,
    DateTime CreatedAt)
{
    
}