using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DAL.Solutions;

internal class SolutionEntityConfiguration : IEntityTypeConfiguration<SolutionEntity>
{
    public void Configure(EntityTypeBuilder<SolutionEntity> builder)
    {
        builder.HasKey(e => e.Id);

        builder.HasOne(e => e.Assignment)
            .WithMany(e2 => e2.Solutions)
            .HasForeignKey(e => e.AssignmentId);

        builder.HasOne(e => e.CandidateOwner)
            .WithMany(e2 => e2.SolutionsOwned)
            .HasForeignKey(e => e.CandidateOwnerId);

        builder.HasMany(e => e.Candidates)
            .WithMany(e2 => e2.Solutions);
        
        builder.HasMany(e => e.CandidatesJoinRequested)
            .WithMany(e2 => e2.SolutionsJoinRequested);

        builder.OwnsOne(e => e.Team);

        builder.HasMany(e => e.ExpertReviews)
            .WithOne(e2 => e2.Solution);
    }
}
