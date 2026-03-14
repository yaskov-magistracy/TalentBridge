using Domain.EmployerTasks.DTO;

namespace Domain.EmployerTasks;

public interface IEmployerTasksRepository
{
    Task<EmployerTask?> Get(Guid id);
    Task<EmployerTaskSearchResponse> Search(EmployerTaskSearchRequest request);
    Task<EmployerTask> Add(EmployerTaskCreateEntity createEntity);
    Task<EmployerTask> Update(Guid id, EmployerTaskUpdateEntity updateEntity);
}