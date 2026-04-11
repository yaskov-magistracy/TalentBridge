using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DAL.Employers;

internal class EmployerEntityConfiguration : IEntityTypeConfiguration<EmployerEntity>
{
    public void Configure(EntityTypeBuilder<EmployerEntity> builder)
    {
        builder.HasKey(e => e.Id);

        builder.HasMany(e => e.Assignments)
            .WithOne(e2 => e2.Employer);

        builder.HasMany(e => e.Experts)
            .WithOne(e2 => e2.Employer);
    }
}