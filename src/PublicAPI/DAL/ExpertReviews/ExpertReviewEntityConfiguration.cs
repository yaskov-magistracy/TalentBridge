using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DAL.ExpertReviews;

internal class ExpertReviewEntityConfiguration : IEntityTypeConfiguration<ExpertReviewEntity>
{
    public void Configure(EntityTypeBuilder<ExpertReviewEntity> builder)
    {
        builder.HasKey(e => e.Id);

        builder.HasOne(e => e.Expert)
            .WithMany(e2 => e2.ExpertReviews);
        
        builder.HasOne(e => e.Solution)
            .WithMany(e2 => e2.ExpertReviews);
    }
}