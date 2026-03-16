namespace API.EmployerTasks.DTO;

public record EmployerTaskCreateApiRequest(
    string Name,
    string Description,
    string? TemplateUrl,
    DateOnly DeadLine,
    Guid[]? Technologies
)
{
    
}