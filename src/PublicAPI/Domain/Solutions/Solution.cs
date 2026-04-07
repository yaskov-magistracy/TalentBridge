using Domain.Assignments;
using Domain.Candidates;

namespace Domain.Solutions;

public record Solution(
    Guid Id,
    string? SolutionUrl,
    DateOnly? StartedAt,
    SolutionState State,
    SolutionTeam? Team
)
{
    internal bool IsGroup => Team != null;
}

public record SolutionShortInfo(
    Guid Id,
    string? SolutionUrl,
    DateOnly? StartedAt,
    SolutionState State,
    SolutionTeam? Team,
    Guid AssignmentId,
    Guid CandidateOwnerId
) :  Solution(Id, SolutionUrl, StartedAt, State, Team);

public record SolutionFullInfo(
    Guid Id,
    string? SolutionUrl,
    DateOnly? StartedAt,
    SolutionState State,
    SolutionTeam? Team,
    AssignmentFullInfo Assignment,
    Candidate CandidateOwner,
    List<Candidate> Candidates,
    List<Candidate>? CandidatesJoinRequested
) : Solution(Id, SolutionUrl, StartedAt, State, Team);


public record SolutionTeam(
    string Name,
    string Description
);

public enum SolutionState
{
    NotStarted,
    InProgress,
    Reopened,
    Autotests,
    AiReview,
    ExpertReview,
    Canceled,
}