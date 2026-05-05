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
            CandidatesCapacity = createEntity.CandidatesCapacity,
            Difficulty = ToEntity(createEntity.Difficulty),
            AttemptsCoefficients = createEntity.AttemptsCoefficients,
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
            assignment.DeadLine,
            assignment.CandidatesCapacity,
            ToDomain(assignment.Difficulty),
            assignment.AttemptsCoefficients);
    
    public static AssignmentFullInfo ToDomainFull(AssignmentEntity assignment)
        => new(
            assignment.Id,
            assignment.Name, 
            assignment.Description, 
            assignment.TemplateUrl, 
            assignment.DeadLine,
            assignment.CandidatesCapacity,
            ToDomain(assignment.Difficulty),
            assignment.AttemptsCoefficients,
            EmployersMapper.ToDomain(assignment.Employer),
            assignment.Technologies?.Select(TechnologiesMapper.ToDomain).ToArray());

    public static AssignmentEntityDifficulty ToEntity(AssignmentDifficulty model)
        => model switch
        {
            AssignmentDifficulty.Normal => AssignmentEntityDifficulty.Normal,
            AssignmentDifficulty.Advanced => AssignmentEntityDifficulty.Advanced,
            AssignmentDifficulty.Hard => AssignmentEntityDifficulty.Hard,
            _ => throw new ArgumentOutOfRangeException(nameof(model), model, null)
        };
    
    public static AssignmentDifficulty ToDomain(AssignmentEntityDifficulty entity)
        => entity switch
        {
            AssignmentEntityDifficulty.Normal => AssignmentDifficulty.Normal,
            AssignmentEntityDifficulty.Advanced => AssignmentDifficulty.Advanced,
            AssignmentEntityDifficulty.Hard => AssignmentDifficulty.Hard,
            _ => throw new ArgumentOutOfRangeException(nameof(entity), entity, null)
        };
}