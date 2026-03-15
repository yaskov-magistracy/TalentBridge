using Domain.Technologies.DTO;
using Infrastructure.Results;

namespace Domain.Technologies;

public interface ITechnologiesService
{
    Task<Result<Technology>> Get(Guid id);
    Task<Result<TechnologySearchResponse>> Search(TechnologySearchRequest request);
    Task<Result<Technology>> Add(TechnologyCreateEntity createEntity);
    Task<EmptyResult> AddBatch(TechnologyCreateEntity[] createEntities);
    Task<Result<Technology>> Update(Guid id, TechnologyUpdateEntity updateEntity);
}

public class TechnologiesService(
    ITechnologiesRepository technologiesRepository
) : ITechnologiesService
{
    public async Task<Result<Technology>> Get(Guid id)
    {
        var employerTask = await technologiesRepository.Get(id);
        if (employerTask == null)
            return Results.NotFound<Technology>();
        
        return Results.Ok(employerTask);
    }

    public async Task<Result<TechnologySearchResponse>> Search(TechnologySearchRequest request)
    {
        var searchResponse = await technologiesRepository.Search(request);
        return Results.Ok(searchResponse);
    }

    public async Task<Result<Technology>> Add(TechnologyCreateEntity createEntity)
    {
        var newTechnology = await technologiesRepository.Add(createEntity);
        return Results.Ok(newTechnology);
    }

    public async Task<EmptyResult> AddBatch(TechnologyCreateEntity[] createEntities)
    {
        await technologiesRepository.AddBatch(createEntities);
        return EmptyResults.NoContent();
    }

    public async Task<Result<Technology>> Update(Guid id, TechnologyUpdateEntity updateEntity)
    {
        var existed = await technologiesRepository.Get(id);
        if (existed == null)
            return Results.NotFound<Technology>();
        
        var updated = await technologiesRepository.Update(id, updateEntity);
        return Results.Ok(updated);
    }
}