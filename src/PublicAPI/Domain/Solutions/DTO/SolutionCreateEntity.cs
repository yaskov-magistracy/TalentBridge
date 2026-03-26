namespace Domain.Solutions.DTO;

public record SolutionCreateEntity(
    string? SolutionUrl,
    DateOnly StartedAt,
    SolutionState State,
    TeamCreateEntity? Team,
    Guid AssignmentId,
    Guid CandidateId)
{
}

public record TeamCreateEntity(
    string Name,
    string Description
);
