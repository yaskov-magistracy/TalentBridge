using Domain.Candidates;
using Domain.EmployerTasks;

namespace Domain.Solutions;

public record SolutionBase(
    Guid Id,
    string SolutionUrl,
    DateOnly StartedAt,
    SolutionState State
);

public record SolutionShortInfo(
    Guid Id,
    string SolutionUrl,
    DateOnly StartedAt,
    SolutionState State,
    Guid EmployerTaskId,
    Guid CandidateId
) :  SolutionBase(Id, SolutionUrl, StartedAt, State);

public record SolutionFullInfo(
    Guid Id,
    string SolutionUrl,
    DateOnly StartedAt,
    SolutionState State,
    EmployerTask EmployerTask,
    Candidate Candidate
) : SolutionBase(Id, SolutionUrl, StartedAt, State);

public enum SolutionState
{
    InProgress,
    Reopened,
    Autotests,
    AiReview,
    ExpertReview,
    Canceled,
}