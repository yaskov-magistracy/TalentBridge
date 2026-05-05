using Domain.AiChats;
using Domain.AiChats.DTO;
using Microsoft.EntityFrameworkCore;

namespace DAL.AiChats;

public class AiChatsRepository(
    DataContext dataContext
) : IAiChatsRepository
{
    private DbSet<AiChatEntity> AiChats => dataContext.AiChats;
    private IQueryable<AiChatEntity> AiChatsSearch => AiChats.AsNoTracking();
    private IQueryable<AiChatEntity> AiActiveChatsSearch => AiChatsSearch.Where(e => e.IsArchived == false);
    private IQueryable<AiChatEntity> AiChatsFullSearch => AiChatsFull.AsNoTracking();
    private IQueryable<AiChatEntity> AiActiveChatsFullSearch => AiChatsFullSearch.Where(e => e.IsArchived == false);
    private IQueryable<AiChatEntity> AiChatsFull => AiChats
        .Include(e => e.Messages!.OrderBy(m => m.CreatedAt));
    
    private DbSet<AiChatMessageEntity> AiChatMessages => dataContext.AiChatMessages;
    private IQueryable<AiChatMessageEntity> AiChatMessagesSearch => AiChatMessages.AsNoTracking();
    private IQueryable<AiChatMessageEntity> AiChatMessagesFullSearch => AiChatMessagesFull.AsNoTracking();
    private IQueryable<AiChatMessageEntity> AiChatMessagesFull => AiChatMessages;
    
    public async Task<bool> Exists(Guid chatId)
    {
        var existed = await AiActiveChatsSearch.FirstOrDefaultAsync(e => e.Id == chatId);
        return existed != null;
    }

    public async Task<AiChat?> Get(Guid chatId)
    {
        var chat = await AiActiveChatsSearch.FirstOrDefaultAsync(e => e.Id == chatId);
        return chat == null 
            ? null 
            : AiChatsMapper.ToDomain(chat);
    }

    public async Task<AiChat?> GetByUserId(Guid userId)
    {
        var chat = await AiActiveChatsFullSearch.FirstOrDefaultAsync(e => e.UserId == userId);
        return chat == null 
            ? null 
            : AiChatsMapper.ToDomain(chat);
    }

    public async Task<AiChatMessage?> GetMessage(Guid messageId)
    {
        var message = await AiChatMessagesSearch.FirstOrDefaultAsync(e => e.Id == messageId);
        return message == null
            ? null
            : AiChatsMapper.ToDomain(message);
    }

    public async Task<Guid> Create(AiChatCreateEntity createEntity)
    {
        var newEntity = AiChatsMapper.ToEntity(createEntity);
        await AiChats.AddAsync(newEntity);
        await dataContext.SaveChangesAsync();
        return newEntity.Id;
    }

    public async Task<(Guid userReqId, Guid aiResId)> SendMessage(Guid chatId, AiChatMessageCreateEntity[] createEntity)
    {
        var messages = createEntity.Select(AiChatsMapper.ToEntity).ToArray();
        await AiChatMessages.AddRangeAsync(messages);
        await dataContext.SaveChangesAsync();
        return (messages.First().Id, messages.Last().Id);
    }

    public async Task Patch(Guid chatId, AiChatPatchEntity patchEntity)
    {
        var existed = await AiChats.FirstAsync(e => e.Id == chatId);
        
        if (patchEntity.IsArchived != null)
            existed.IsArchived = patchEntity.IsArchived.Value;
        
        await dataContext.SaveChangesAsync();
    }
}