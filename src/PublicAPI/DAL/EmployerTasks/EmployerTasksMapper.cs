using DAL.Employers;
using DAL.Technologies;
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
            TemplateUrl = createEntity.TemplateUrl,
            DeadLine = createEntity.DeadLine,
            Employer = new()
            {
                Id = createEntity.EmployerId
            },
            Technologies = createEntity.Technologies?.Select(e => new TechnologyEntity()
            {
                Id = e,
            }).ToList(),
        };

    public static EmployerTask ToDomain(EmployerTaskEntity employerTask)
        => new(
            employerTask.Id,
            employerTask.Name, 
            employerTask.Description, 
            employerTask.TemplateUrl, 
            employerTask.DeadLine);
    
    public static EmployerTaskFullInfo ToDomainFull(EmployerTaskEntity employerTask)
        => new(
            employerTask.Id,
            employerTask.Name, 
            employerTask.Description, 
            employerTask.TemplateUrl, 
            employerTask.DeadLine,
            EmployersMapper.ToDomain(employerTask.Employer),
            employerTask.Technologies?.Select(TechnologiesMapper.ToDomain).ToArray());
}