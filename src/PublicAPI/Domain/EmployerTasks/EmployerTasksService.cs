using Domain.EmployerTasks.DTO;
using Infrastructure.Results;

namespace Domain.EmployerTasks;

public interface IEmployerTasksService
{
    Task<Result<EmployerTask>> Get(Guid id);
    Task<Result<EmployerTaskSearchResponse>> Search(EmployerTaskSearchRequest request);
    Task<Result<EmployerTask>> Add(EmployerTaskCreateEntity createEntity);
    Task<Result<EmployerTask>> Update(Guid employerId, Guid id, EmployerTaskUpdateEntity updateEntity);
}

public class EmployerTasksService(
    IEmployerTasksRepository employerTasksRepository
) : IEmployerTasksService
{
    public async Task<Result<EmployerTask>> Get(Guid id)
    {
        var employerTask = await employerTasksRepository.Get(id);
        if (employerTask == null)
            return Results.NotFound<EmployerTask>();
        
        return Results.Ok(employerTask);
    }

    public async Task<Result<EmployerTaskSearchResponse>> Search(EmployerTaskSearchRequest request)
    {
        var searchResponse = await employerTasksRepository.Search(request);
        return Results.Ok(searchResponse);
    }

    public async Task<Result<EmployerTask>> Add(EmployerTaskCreateEntity createEntity)
    {
        var newTask = await employerTasksRepository.Add(createEntity);
        return Results.Ok(newTask);
    }

    public async Task<Result<EmployerTask>> Update(Guid employerId, Guid id, EmployerTaskUpdateEntity updateEntity)
    {
        var existed = await employerTasksRepository.Get(id);
        if (existed == null)
            return Results.NotFound<EmployerTask>();
        if (existed.EmployerId != employerId)
            return Results.Forbidden<EmployerTask>();
        
        var updated = await employerTasksRepository.Update(id, updateEntity);
        return Results.Ok(updated);
    }
}