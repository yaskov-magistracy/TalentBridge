using Domain.Employers;
using Domain.Technologies;

namespace Domain.Assignments;

public record Assignment(
    Guid Id,
    string Name,
    string Description,
    string? TemplateUrl,
    DateOnly DeadLine)
{
}

public record AssignmentFullInfo(
    Guid Id,
    string Name,
    string Description,
    string? TemplateUrl,
    DateOnly DeadLine,
    Employer Employer,
    Technology[]? Technologies
) : Assignment(Id, Name, Description, TemplateUrl, DeadLine);