using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DAL.Candidates;

internal class CandidateEntityConfiguration : IEntityTypeConfiguration<CandidateEntity>
{
    public void Configure(EntityTypeBuilder<CandidateEntity> builder)
    {
        builder.HasKey(e => e.Id);

        builder.HasMany(e => e.Technologies)
            .WithMany(e2 => e2.Candidates);
        
        builder.HasMany(e => e.Solutions)
            .WithMany(e2 => e2.Candidates);
    }
}