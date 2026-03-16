using Domain.EmployerTasks.DTO;

namespace Domain.EmployerTasks;

public interface IEmployerTasksRepository
{
    Task<EmployerTask?> Get(Guid id);
    Task<(EmployerTask task, Guid employerId)?> GetWithOwner(Guid id);
    Task<EmployerTaskFullInfo?> GetFull(Guid id);
    Task<EmployerTaskSearchResponse> Search(EmployerTaskSearchRequest request);
    Task<EmployerTaskFullInfo> Add(EmployerTaskCreateEntity createEntity);
    Task<EmployerTaskFullInfo> Update(Guid id, EmployerTaskUpdateEntity updateEntity);
}