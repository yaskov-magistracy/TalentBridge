using Domain.AiChats.DTO;

namespace Domain.AiChats;

public interface IAiChatsRepository
{
    Task<bool> Exists(Guid chatId);
    Task<AiChat?> Get(Guid chatId);
    Task<AiChat?> GetByUserId(Guid userId);
    Task<AiChatMessage?> GetMessage(Guid messageId);
    Task<Guid> Create(AiChatCreateEntity createEntity);
    Task<(Guid userReqId, Guid aiResId)> SendMessage(Guid chatId, AiChatMessageCreateEntity[] createEntity);
    Task Patch(Guid chatId, AiChatPatchEntity patchEntity);
}