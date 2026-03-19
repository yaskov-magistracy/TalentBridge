using DAL.Candidates;
using DAL.EmployerTasks;
using Domain.Solutions;
using Domain.Solutions.DTO;

namespace DAL.Solutions;

internal static class SolutionsMapper
{
    public static SolutionShortInfo ToDomain(SolutionEntity entity)
        => new(
            entity.Id,
            entity.SolutionUrl,
            entity.StartedAt,
            ToDomain(entity.State),
            entity.EmployerTaskId,
            entity.CandidateId
        );

    public static SolutionFullInfo ToDomainFull(SolutionEntity entity)
        => new(
            entity.Id,
            entity.SolutionUrl,
            entity.StartedAt,
            ToDomain(entity.State),
            EmployerTasksMapper.ToDomain(entity.EmployerTask),
            CandidatesMapper.ToDomain(entity.Candidate)
        );

    public static SolutionEntity ToEntity(SolutionCreateEntity createEntity)
        => new()
        {
            SolutionUrl = createEntity.SolutionUrl,
            StartedAt = createEntity.StartedAt,
            State = ToEntity(createEntity.State),
            EmployerTaskId = createEntity.EmployerTaskId,
            EmployerTask = new()
            {
                Id = createEntity.EmployerTaskId,
            },
            CandidateId = createEntity.CandidateId,
            Candidate = new()
            {
                Id = createEntity.CandidateId,
            }
        };

    public static SolutionEntityState ToEntity(SolutionState state)
        => state switch
        {
            SolutionState.InProgress => SolutionEntityState.InProgress,
            SolutionState.Reopened => SolutionEntityState.Reopened,
            SolutionState.Autotests => SolutionEntityState.Autotests,
            SolutionState.AiReview => SolutionEntityState.AiReview,
            SolutionState.ExpertReview => SolutionEntityState.ExpertReview,
            SolutionState.Canceled => SolutionEntityState.Canceled,
            _ => throw new ArgumentOutOfRangeException(nameof(state), state, null)
        };
    
    public static SolutionState ToDomain(SolutionEntityState state)
        => state switch
        {
            SolutionEntityState.InProgress => SolutionState.InProgress,
            SolutionEntityState.Reopened => SolutionState.Reopened,
            SolutionEntityState.Autotests => SolutionState.Autotests,
            SolutionEntityState.AiReview => SolutionState.AiReview,
            SolutionEntityState.ExpertReview => SolutionState.ExpertReview,
            SolutionEntityState.Canceled => SolutionState.Canceled,
            _ => throw new ArgumentOutOfRangeException(nameof(state), state, null)
        };
}
