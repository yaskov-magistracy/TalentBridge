namespace Domain.Solutions.DTO;

public record SolutionCreateEntity(
    string? SolutionUrl,
    DateOnly StartedAt,
    SolutionState State,
    Guid EmployerTaskId,
    Guid CandidateId)
{
}
