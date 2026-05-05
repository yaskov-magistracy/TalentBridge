using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DAL.Experts;

internal class ExpertEntityConfiguration : IEntityTypeConfiguration<ExpertEntity>
{
    public void Configure(EntityTypeBuilder<ExpertEntity> builder)
    {
        builder.HasKey(e => e.Id);

        builder.HasOne(e => e.Employer)
            .WithMany(e => e.Experts);
        
        builder.HasMany(e => e.ExpertReviews)
            .WithOne(e => e.Expert);
    }
}