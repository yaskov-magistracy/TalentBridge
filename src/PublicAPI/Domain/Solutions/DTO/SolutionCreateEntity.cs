namespace Domain.Solutions.DTO;

public record SolutionCreateEntity(
    string? SolutionUrl,
    SolutionState State,
    SolutionTeamCreateEntity? Team,
    Guid AssignmentId,
    Guid CandidateId)
{
}

public record SolutionTeamCreateEntity(
    string Name,
    string Description
);
