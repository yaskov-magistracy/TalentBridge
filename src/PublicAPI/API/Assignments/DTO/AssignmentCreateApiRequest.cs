using Domain.Assignments;

namespace API.Assignments.DTO;

public record AssignmentCreateApiRequest(
    string Name,
    string Description,
    string? TemplateUrl,
    DateOnly DeadLine,
    int CandidatesCapacity,
    AssignmentDifficulty Difficulty,
    float[] AttemptsCoefficients,
    int MaxAttemptNumberToGrantMedal = 1,
    Guid[]? Technologies = null
)
{
    
}