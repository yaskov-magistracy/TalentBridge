using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DAL.Technologies;

internal class TechnologyEntityConfiguration : IEntityTypeConfiguration<TechnologyEntity>
{
    public void Configure(EntityTypeBuilder<TechnologyEntity> builder)
    {
        builder.HasKey(e => e.Id);

        builder.HasMany(e => e.Candidates)
            .WithMany(e2 => e2.Technologies);
    }
}