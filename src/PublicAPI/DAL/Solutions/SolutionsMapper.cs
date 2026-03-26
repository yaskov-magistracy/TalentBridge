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
            entity.Team == null ? null : ToDomain(entity.Team),
            entity.AssignmentId,
            entity.CandidateOwnerId
        );

    public static SolutionFullInfo ToDomainFull(SolutionEntity entity)
        => new(
            entity.Id,
            entity.SolutionUrl,
            entity.StartedAt,
            ToDomain(entity.State),
            entity.Team == null ? null : ToDomain(entity.Team),
            AssignmentsMapper.ToDomain(entity.Assignment),
            CandidatesMapper.ToDomain(entity.CandidateOwner),
            entity.Candidates.Select(CandidatesMapper.ToDomain).ToList()
        );

    public static SolutionEntity ToEntity(SolutionCreateEntity createEntity)
    {
        var candidateOwner = new CandidateEntity() { Id = createEntity.CandidateId };
        return new()
        {
            SolutionUrl = createEntity.SolutionUrl,
            StartedAt = createEntity.StartedAt,
            State = ToEntity(createEntity.State),
            AssignmentId = createEntity.AssignmentId,
            Assignment = new()
            {
                Id = createEntity.AssignmentId,
            },
            CandidateOwnerId = createEntity.CandidateId,
            CandidateOwner = candidateOwner,
            Candidates = [candidateOwner]
        };
    }

    public static SolutionTeamEntity ToEntity(SolutionTeamEntity entity)
        => new()
        {
            Name = entity.Name,
            Description = entity.Description,
        };
    
    public static SolutionTeam ToDomain(SolutionTeamEntity entity)
        => new(entity.Name, entity.Description);
    

    public static SolutionEntityState ToEntity(SolutionState state)
        => state switch
        {
            SolutionState.NotStarted => SolutionEntityState.NotStarted,
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
            SolutionEntityState.NotStarted => SolutionState.NotStarted,
            SolutionEntityState.InProgress => SolutionState.InProgress,
            SolutionEntityState.Reopened => SolutionState.Reopened,
            SolutionEntityState.Autotests => SolutionState.Autotests,
            SolutionEntityState.AiReview => SolutionState.AiReview,
            SolutionEntityState.ExpertReview => SolutionState.ExpertReview,
            SolutionEntityState.Canceled => SolutionState.Canceled,
            _ => throw new ArgumentOutOfRangeException(nameof(state), state, null)
        };
}
