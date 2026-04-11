using DAL.Assignments;
using DAL.Candidates;
using DAL.Experts;
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
            AssignmentsMapper.ToDomainFull(entity.Assignment),
            CandidatesMapper.ToDomain(entity.CandidateOwner),
            entity.Candidates.Select(CandidatesMapper.ToDomain).ToList(),
            entity.CandidatesJoinRequested?.Select(CandidatesMapper.ToDomain).ToList(),
            entity.ExpertReview,
            entity.Expert == null ? null : ExpertsMapper.ToDomain(entity.Expert)
        );

    public static SolutionEntity ToEntity(SolutionCreateEntity createEntity)
    {
        var candidateOwner = new CandidateEntity() { Id = createEntity.CandidateId };
        return new()
        {
            SolutionUrl = createEntity.SolutionUrl,
            StartedAt = null,
            State = ToEntity(createEntity.State),
            AssignmentId = createEntity.AssignmentId,
            Assignment = new()
            {
                Id = createEntity.AssignmentId,
            },
            CandidateOwnerId = createEntity.CandidateId,
            CandidateOwner = candidateOwner,
            Candidates = [candidateOwner],
            Team = createEntity.Team == null ? null : ToEntity(createEntity.Team),
        };
    }

    public static SolutionTeamEntity ToEntity(SolutionTeamCreateEntity createEntity)
        => new()
        {
            Name = createEntity.Name,
            Description = createEntity.Description,
        };
    
    public static SolutionTeam ToDomain(SolutionTeamEntity entity)
        => new(entity.Name, entity.Description);
    

    public static SolutionEntityState ToEntity(SolutionState state)
        => state switch
        {
            SolutionState.NotStarted => SolutionEntityState.NotStarted,
            SolutionState.InProgress => SolutionEntityState.InProgress,
            SolutionState.Autotests => SolutionEntityState.Autotests,
            SolutionState.AiReview => SolutionEntityState.AiReview,
            SolutionState.ExpertReview => SolutionEntityState.ExpertReview,
            SolutionState.Done => SolutionEntityState.Done,
            SolutionState.Rejected => SolutionEntityState.Rejected,
            _ => throw new ArgumentOutOfRangeException(nameof(state), state, null)
        };
    
    public static SolutionState ToDomain(SolutionEntityState state)
        => state switch
        {
            SolutionEntityState.NotStarted => SolutionState.NotStarted,
            SolutionEntityState.InProgress => SolutionState.InProgress,
            SolutionEntityState.Autotests => SolutionState.Autotests,
            SolutionEntityState.AiReview => SolutionState.AiReview,
            SolutionEntityState.ExpertReview => SolutionState.ExpertReview,
            SolutionEntityState.Done => SolutionState.Done,
            SolutionEntityState.Rejected => SolutionState.Rejected,
            _ => throw new ArgumentOutOfRangeException(nameof(state), state, null)
        };
}
