using DAL.Assignments;
using DAL.Candidates;
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
            entity.AssignmentId,
            entity.CandidateId
        );

    public static SolutionFullInfo ToDomainFull(SolutionEntity entity)
        => new(
            entity.Id,
            entity.SolutionUrl,
            entity.StartedAt,
            ToDomain(entity.State),
            AssignmentsMapper.ToDomain(entity.Assignment),
            CandidatesMapper.ToDomain(entity.Candidate)
        );

    public static SolutionEntity ToEntity(SolutionCreateEntity createEntity)
        => new()
        {
            SolutionUrl = createEntity.SolutionUrl,
            StartedAt = createEntity.StartedAt,
            State = ToEntity(createEntity.State),
            AssignmentId = createEntity.AssignmentId,
            Assignment = new()
            {
                Id = createEntity.AssignmentId,
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
