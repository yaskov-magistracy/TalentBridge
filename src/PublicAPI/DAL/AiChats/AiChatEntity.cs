using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DAL.AiChats;

internal class AiChatEntity : IEntity
{
    [Key] public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public bool IsArchived { get; set; }
    public List<AiChatMessageEntity>? Messages { get; set; }
}

internal class AiChatMessageEntity
{
    [Key] public Guid Id { get; set; }
    public string Text { get; set; }
    public AiChatMessageEntityAuthor Author { get; set; }
    public DateTime CreatedAt { get; set; }
    
    [ForeignKey(nameof(AiChat))] public Guid AiChatId { get; set; }
    public AiChatEntity AiChat { get; set; }
}

internal enum AiChatMessageEntityAuthor
{
    Ai,
    User,
}