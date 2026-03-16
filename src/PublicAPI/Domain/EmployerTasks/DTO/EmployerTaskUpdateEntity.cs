using Infrastructure.DTO;

namespace Domain.EmployerTasks.DTO;

public record EmployerTaskUpdateEntity(
    string? Name,
    string? Description,
    NullablePatch<string?>? TemplateUrl,
    DateOnly? DeadLine,
    RelationsPatch? Technologies)
{
    
}