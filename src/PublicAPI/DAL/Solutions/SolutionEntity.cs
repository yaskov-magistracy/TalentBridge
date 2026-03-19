using System.ComponentModel.DataAnnotations.Schema;
using DAL.Candidates;
using DAL.EmployerTasks;

namespace DAL.Solutions;

internal class SolutionEntity : IEntity
{
    public Guid Id { get; set; }
    public string? SolutionUrl { get; set; }
    public DateOnly StartedAt { get; set; }
    public SolutionEntityState State { get; set; }
    
    [ForeignKey(nameof(EmployerTask))] public Guid EmployerTaskId { get; set; }
    public EmployerTaskEntity EmployerTask { get; set; }
    
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