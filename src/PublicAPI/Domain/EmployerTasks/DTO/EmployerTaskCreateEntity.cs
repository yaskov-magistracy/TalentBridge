namespace Domain.EmployerTasks.DTO;

public record EmployerTaskCreateEntity(
    string Name,
    string Description,
    string? TemplateUrl,
    DateOnly DeadLine,
    Guid EmployerId,
    Guid[]? Technologies)
{
    
}