namespace Domain.Solutions.DTO;

public record SolutionCreateEntity(
    string? SolutionUrl,
    DateOnly StartedAt,
    SolutionState State,
    Guid AssignmentId,
    Guid CandidateId)
{
}
