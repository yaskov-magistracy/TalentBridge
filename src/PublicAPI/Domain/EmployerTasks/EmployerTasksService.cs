using Domain.EmployerTasks.DTO;
using Infrastructure.Results;

namespace Domain.EmployerTasks;

public interface IEmployerTasksService
{
    Task<Result<EmployerTaskFullInfo>> Get(Guid id);
    Task<Result<EmployerTaskSearchResponse>> Search(EmployerTaskSearchRequest request);
    Task<Result<EmployerTaskFullInfo>> Add(EmployerTaskCreateEntity createEntity);
    Task<Result<EmployerTaskFullInfo>> Update(Guid employerId, Guid id, EmployerTaskUpdateEntity updateEntity);
}

public class EmployerTasksService(
    IEmployerTasksRepository employerTasksRepository
) : IEmployerTasksService
{
    public async Task<Result<EmployerTaskFullInfo>> Get(Guid id)
    {
        var employerTask = await employerTasksRepository.GetFull(id);
        if (employerTask == null)
            return Results.NotFound<EmployerTaskFullInfo>();
        
        return Results.Ok(employerTask);
    }

    public async Task<Result<EmployerTaskSearchResponse>> Search(EmployerTaskSearchRequest request)
    {
        var searchResponse = await employerTasksRepository.Search(request);
        return Results.Ok(searchResponse);
    }

    public async Task<Result<EmployerTaskFullInfo>> Add(EmployerTaskCreateEntity createEntity)
    {
        var newTask = await employerTasksRepository.Add(createEntity);
        return Results.Ok(newTask);
    }

    public async Task<Result<EmployerTaskFullInfo>> Update(Guid employerId, Guid id, EmployerTaskUpdateEntity updateEntity)
    {
        var pair = await employerTasksRepository.GetWithOwner(id);
        if (pair == null)
            return Results.NotFound<EmployerTaskFullInfo>();
        if (pair.Value.employerId != employerId)
            return Results.Forbidden<EmployerTaskFullInfo>();
        
        var updated = await employerTasksRepository.Update(id, updateEntity);
        return Results.Ok(updated);
    }
}