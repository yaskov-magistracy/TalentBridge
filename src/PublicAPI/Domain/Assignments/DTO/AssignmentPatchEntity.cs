using Infrastructure.DTO;

namespace Domain.Assignments.DTO;

public record AssignmentPatchEntity(
    string? Name,
    string? Description,
    NullablePatch<string?>? TemplateUrl,
    DateOnly? DeadLine,
    int? CandidatesCapacity,
    float[]? AttemptsCoefficients,
    RelationsPatch? Technologies)
{
    
}