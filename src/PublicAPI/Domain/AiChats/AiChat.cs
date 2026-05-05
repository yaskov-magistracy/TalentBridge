namespace Domain.AiChats;

public record AiChat(
    Guid Id,
    Guid UserId,
    AiChatMessage[] Messages)
{
    
}

public record AiChatMessage(
    Guid Id,
    string Text,
    AiChatMessageAuthor Author,
    DateTime CreatedAt
)
{
    
}

public enum AiChatMessageAuthor
{
    Ai,
    User,
}