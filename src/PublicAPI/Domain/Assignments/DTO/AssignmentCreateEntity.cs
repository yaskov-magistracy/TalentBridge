namespace Domain.Assignments.DTO;

public record AssignmentCreateEntity(
    string Name,
    string Description,
    string? TemplateUrl,
    DateOnly DeadLine,
    int CandidatesCapacity,
    AssignmentDifficulty Difficulty,
    float[] AttemptsCoefficients,
    bool IsPrivate,
    Guid EmployerId,
    Guid[]? Technologies)
{
    
}