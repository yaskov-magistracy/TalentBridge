using Domain.Assignments;
using Domain.Candidates;
using Domain.ExpertReviews;
using Domain.Experts;

namespace Domain.Solutions;

public record Solution(
    Guid Id,
    string? SolutionUrl,
    DateOnly? StartedAt,
    SolutionState State,
    SolutionTeam? Team,
    DateTime? MedalGrantedAt
)
{
    internal bool IsGroup => Team != null;
    internal bool HasMedal => MedalGrantedAt != null;
}

public record SolutionShortInfo(
    Guid Id,
    string? SolutionUrl,
    DateOnly? StartedAt,
    SolutionState State,
    SolutionTeam? Team,
    DateTime? MedalGrantedAt,
    Guid AssignmentId,
    Guid CandidateOwnerId
) :  Solution(Id, SolutionUrl, StartedAt, State, Team, MedalGrantedAt);

public record SolutionFullInfo(
    Guid Id,
    string? SolutionUrl,
    DateOnly? StartedAt,
    SolutionState State,
    SolutionTeam? Team,
    DateTime? MedalGrantedAt,
    AssignmentFullInfo Assignment,
    Candidate CandidateOwner,
    List<Candidate> Candidates,
    List<Candidate>? CandidatesJoinRequested,
    List<ExpertReviewInSolution>? ExpertReviews
) : Solution(Id, SolutionUrl, StartedAt, State, Team, MedalGrantedAt)
{
    internal ExpertReviewInSolution GetLastReview()
        => ExpertReviews!.OrderByDescending(e => e.CreatedAt).First();
}


public record SolutionTeam(
    string Name,
    string Description
);

public enum SolutionState
{
    NotStarted,
    InProgress,
    Autotests,
    AiReview,
    ExpertReview,
    RequiresImprovements,
    Done,
    Failed,
}