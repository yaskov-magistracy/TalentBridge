namespace API.Assignments.DTO;

public record AssignmentCreateApiRequest(
    string Name,
    string Description,
    string? TemplateUrl,
    DateOnly DeadLine,
    int CandidatesCapacity,
    float[] AttemptsCoefficients,
    Guid[]? Technologies = null
)
{
    
}