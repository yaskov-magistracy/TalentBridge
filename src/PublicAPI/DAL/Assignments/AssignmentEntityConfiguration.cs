using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DAL.Assignments;

internal class AssignmentEntityConfiguration : IEntityTypeConfiguration<AssignmentEntity>
{
    public void Configure(EntityTypeBuilder<AssignmentEntity> builder)
    {
        builder.HasKey(e => e.Id);

        builder.HasOne(e => e.Employer)
            .WithMany(e2 => e2.Assignments)
            .HasForeignKey(e => e.EmployerId);
        
        builder.HasMany(e => e.Technologies)
            .WithMany(e2 => e2.Assignments);
    }
}