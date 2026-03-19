using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DAL.Solutions;

internal class SolutionEntityConfiguration : IEntityTypeConfiguration<SolutionEntity>
{
    public void Configure(EntityTypeBuilder<SolutionEntity> builder)
    {
        builder.HasKey(e => e.Id);

        builder.HasOne(e => e.EmployerTask)
            .WithMany(e2 => e2.Solutions)
            .HasForeignKey(e => e.EmployerTaskId);

        builder.HasOne(e => e.Candidate)
            .WithMany(e2 => e2.Solutions)
            .HasForeignKey(e => e.CandidateId);
    }
}
