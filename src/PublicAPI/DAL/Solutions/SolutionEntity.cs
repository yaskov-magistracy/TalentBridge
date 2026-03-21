using System.ComponentModel.DataAnnotations.Schema;
using DAL.Assignments;
using DAL.Candidates;

namespace DAL.Solutions;

internal class SolutionEntity : IEntity
{
    public Guid Id { get; set; }
    public string? SolutionUrl { get; set; }
    public DateOnly StartedAt { get; set; }
    public SolutionEntityState State { get; set; }
    
    [ForeignKey(nameof(Assignment))] public Guid AssignmentId { get; set; }
    public AssignmentEntity Assignment { get; set; }
    
    [ForeignKey(nameof(Candidate))] public Guid CandidateId { get; set; }
    public CandidateEntity Candidate { get; set; }
}

internal enum SolutionEntityState
{
    InProgress,
    Reopened,
    Autotests,
    AiReview,
    ExpertReview,
    Canceled,
}