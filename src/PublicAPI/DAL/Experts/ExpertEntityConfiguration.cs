using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DAL.Experts;

public class ExpertEntityConfiguration : IEntityTypeConfiguration<ExpertEntity>
{
    public void Configure(EntityTypeBuilder<ExpertEntity> builder)
    {
        builder.HasKey(e => e.Id);
    }
}