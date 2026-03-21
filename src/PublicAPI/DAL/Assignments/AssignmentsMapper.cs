using DAL.Employers;
using DAL.Technologies;
using Domain.Assignments;
using Domain.Assignments.DTO;

namespace DAL.Assignments;

internal static class AssignmentsMapper
{
    public static AssignmentEntity ToEntity(AssignmentCreateEntity createEntity)
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

    public static Assignment ToDomain(AssignmentEntity assignment)
        => new(
            assignment.Id,
            assignment.Name, 
            assignment.Description, 
            assignment.TemplateUrl, 
            assignment.DeadLine);
    
    public static AssignmentFullInfo ToDomainFull(AssignmentEntity assignment)
        => new(
            assignment.Id,
            assignment.Name, 
            assignment.Description, 
            assignment.TemplateUrl, 
            assignment.DeadLine,
            EmployersMapper.ToDomain(assignment.Employer),
            assignment.Technologies?.Select(TechnologiesMapper.ToDomain).ToArray());
}