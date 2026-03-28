using Infrastructure.DTO;

namespace Domain.Assignments.DTO;

public record AssignmentUpdateEntity(
    string? Name,
    string? Description,
    NullablePatch<string?>? TemplateUrl,
    DateOnly? DeadLine,
    int? CandidatesCapacity,
    RelationsPatch? Technologies)
{
    
}