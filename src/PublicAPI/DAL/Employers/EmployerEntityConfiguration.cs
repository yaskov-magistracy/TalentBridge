using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DAL.Employers;

public class EmployerEntityConfiguration : IEntityTypeConfiguration<EmployerEntity>
{
    public void Configure(EntityTypeBuilder<EmployerEntity> builder)
    {
        builder.HasKey(e => e.Id);
    }
}