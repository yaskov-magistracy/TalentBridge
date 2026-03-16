using Domain.Technologies;
using Domain.Technologies.DTO;

namespace DAL.Technologies;

internal static class TechnologiesMapper
{
    public static TechnologyEntity ToEntity(TechnologyCreateEntity createEntity)
        => new()
        {
            Id = Guid.Empty,
            Name = createEntity.Name,
        };

    public static Technology ToDomain(TechnologyEntity entity)
        => new(entity.Id, entity.Name);
}