namespace Domain.EmployerTasks;

public record EmployerTask(
    Guid Id,
    string Name,
    string Description,
    string? TemplateUrl,
    DateOnly DeadLine,
    Guid EmployerId)
{
}