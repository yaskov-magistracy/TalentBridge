using Domain.Employers;
using Domain.Technologies;

namespace Domain.EmployerTasks;

public record EmployerTask(
    Guid Id,
    string Name,
    string Description,
    string? TemplateUrl,
    DateOnly DeadLine)
{
}

public record EmployerTaskFullInfo(
    Guid Id,
    string Name,
    string Description,
    string? TemplateUrl,
    DateOnly DeadLine,
    Employer Employer,
    Technology[]? Technologies
) : EmployerTask(Id, Name, Description, TemplateUrl, DeadLine);