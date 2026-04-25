using System.ComponentModel.DataAnnotations.Schema;
using DAL.Assignments;
using DAL.Candidates;
using DAL.ExpertReviews;
using DAL.Experts;

namespace DAL.Solutions;

internal class SolutionEntity : IEntity
{
    public Guid Id { get; set; }
    public string? SolutionUrl { get; set; }
    public DateOnly? StartedAt { get; set; }
    public SolutionEntityState State { get; set; }
    public SolutionTeamEntity? Team { get; set; }
    
    [ForeignKey(nameof(Assignment))] public Guid AssignmentId { get; set; }
    public AssignmentEntity Assignment { get; set; }
    
    [ForeignKey(nameof(CandidateOwner))] public Guid CandidateOwnerId { get; set; }
    public CandidateEntity CandidateOwner { get; set; }
    public List<CandidateEntity> Candidates { get; set; }
    public List<CandidateEntity>? CandidatesJoinRequested { get; set; }
    
    public List<ExpertReviewEntity>? ExpertReviews { get; set; }
}

internal class SolutionTeamEntity
{
    public required string Name { get; set; }
    public required string Description { get; set; }
}

internal enum SolutionEntityState
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