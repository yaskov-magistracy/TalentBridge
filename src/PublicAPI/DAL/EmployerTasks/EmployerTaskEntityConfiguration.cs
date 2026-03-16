using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DAL.EmployerTasks;

internal class EmployerTaskEntityConfiguration : IEntityTypeConfiguration<EmployerTaskEntity>
{
    public void Configure(EntityTypeBuilder<EmployerTaskEntity> builder)
    {
        builder.HasKey(e => e.Id);

        builder.HasOne(e => e.Employer)
            .WithMany(e2 => e2.EmployerTasks)
            .HasForeignKey(e => e.EmployerId);
        
        builder.HasMany(e => e.Technologies)
            .WithMany(e2 => e2.EmployerTasks);
    }
}