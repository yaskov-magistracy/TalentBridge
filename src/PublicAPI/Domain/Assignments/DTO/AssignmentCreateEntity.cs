namespace Domain.Assignments.DTO;

public record AssignmentCreateEntity(
    string Name,
    string Description,
    string? TemplateUrl,
    DateOnly DeadLine,
    int CandidatesCapacity,
    int AttemptsCapacity,
    Guid EmployerId,
    Guid[]? Technologies)
{
    
}