using Domain.Technologies.DTO;

namespace Domain.Technologies;

public interface ITechnologiesRepository
{
    Task<Technology?> Get(Guid id);
    Task<TechnologySearchResponse> Search(TechnologySearchRequest request);
    Task<Technology> Add(TechnologyCreateEntity createEntity);
    Task AddBatch(TechnologyCreateEntity[] createEntities);
    Task<Technology> Update(Guid id, TechnologyUpdateEntity updateEntity);
}