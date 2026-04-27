namespace Domain.Assignments.DTO;

public record AssignmentCreateEntity(
    string Name,
    string Description,
    string? TemplateUrl,
    DateOnly DeadLine,
    int CandidatesCapacity,
    float[] AttemptsCoefficients,
    Guid EmployerId,
    Guid[]? Technologies)
{
    
}