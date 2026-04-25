namespace API.Assignments.DTO;

public record AssignmentCreateApiRequest(
    string Name,
    string Description,
    string? TemplateUrl,
    DateOnly DeadLine,
    int CandidatesCapacity = 1,
    int AttemptsCapacity = 2,
    Guid[]? Technologies = null
)
{
    
}