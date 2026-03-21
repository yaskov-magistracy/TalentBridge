namespace API.Assignments.DTO;

public record AssignmentCreateApiRequest(
    string Name,
    string Description,
    string? TemplateUrl,
    DateOnly DeadLine,
    Guid[]? Technologies
)
{
    
}