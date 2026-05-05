using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DAL.AiChats;

internal class AiChatEntityConfiguration 
    : IEntityTypeConfiguration<AiChatEntity>, IEntityTypeConfiguration<AiChatMessageEntity>
{
    public void Configure(EntityTypeBuilder<AiChatEntity> builder)
    {
        builder.HasKey(e => e.Id);
        builder.HasMany(e => e.Messages)
            .WithOne(e2 => e2.AiChat)
            .HasForeignKey(e2 => e2.AiChatId);
    }

    public void Configure(EntityTypeBuilder<AiChatMessageEntity> builder)
    {
        builder.HasKey(e => e.Id);
        builder.HasOne(e => e.AiChat)
            .WithMany(e2 => e2.Messages)
            .HasForeignKey(e => e.AiChatId);
    }
}