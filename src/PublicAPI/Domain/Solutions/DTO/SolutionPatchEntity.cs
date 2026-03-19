namespace Domain.Solutions.DTO;

public record SolutionPatchEntity(
    string? SolutionUrl = null,
    SolutionState? State = null)
{
}
