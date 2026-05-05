using System.Text;
using Domain.AiChats;
using Domain.AiChats.DTO;

namespace DAL.AiChats;

internal static class AiChatsMapper
{
    public static AiChatEntity ToEntity(AiChatCreateEntity createEntity)
        => new AiChatEntity()
        {
            UserId = createEntity.UserId,
            Messages = null,
        };

    public static AiChatMessageEntity ToEntity(AiChatMessageCreateEntity createEntity)
        => new AiChatMessageEntity()
        {
            Text = createEntity.Text,
            AiChatId = createEntity.ChatId,
            Author = ToEntity(createEntity.Author),
            CreatedAt = createEntity.CreatedAt,
        };

    public static AiChat ToDomain(AiChatEntity entity)
        => new(
            entity.Id,
            entity.UserId,
            entity.Messages?.Select(ToDomain).ToArray() ?? []);

    public static AiChatMessage ToDomain(AiChatMessageEntity entity)
        => new(
            entity.Id,
            entity.Text,
            ToDomain(entity.Author),
            entity.CreatedAt);

    public static AiChatMessageAuthor ToDomain(AiChatMessageEntityAuthor entity)
        => entity switch
        {
            AiChatMessageEntityAuthor.Ai => AiChatMessageAuthor.Ai,
            AiChatMessageEntityAuthor.User => AiChatMessageAuthor.User,
            _ => throw new NotImplementedException($"Not implemented {nameof(AiChatMessageEntityAuthor)} type {entity.GetType().Name}")
        };
    
    public static AiChatMessageEntityAuthor ToEntity(AiChatMessageAuthor domain)
        => domain switch
        {
            AiChatMessageAuthor.Ai => AiChatMessageEntityAuthor.Ai,
            AiChatMessageAuthor.User => AiChatMessageEntityAuthor.User,
            _ => throw new NotImplementedException($"Not implemented {nameof(AiChatMessageAuthor)} type {domain.GetType().Name}")
        };
}