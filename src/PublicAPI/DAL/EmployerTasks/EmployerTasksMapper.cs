using Domain.EmployerTasks;
using Domain.EmployerTasks.DTO;

namespace DAL.EmployerTasks;

internal static class EmployerTasksMapper
{
    public static EmployerTaskEntity ToEntity(EmployerTaskCreateEntity createEntity)
        => new()
        {
            Name = createEntity.Name,
            Description = createEntity.Description,
            DeadLine = createEntity.DeadLine,
            EmployerId = createEntity.EmployerId
        };

    public static EmployerTask ToDomain(EmployerTaskEntity employerTask)
        => new(
            employerTask.Id,
            employerTask.Name, 
            employerTask.Description, 
            employerTask.TemplateUrl, 
            employerTask.DeadLine,
            employerTask.EmployerId);
}