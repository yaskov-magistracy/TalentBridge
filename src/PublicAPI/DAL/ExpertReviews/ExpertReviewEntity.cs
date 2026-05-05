using System.ComponentModel.DataAnnotations;
using DAL.Experts;
using DAL.Solutions;

namespace DAL.ExpertReviews;

internal class ExpertReviewEntity : IEntity
{
    [Key] public Guid Id { get; set; }
    public ExpertEntity Expert { get; set; }
    public SolutionEntity Solution { get; set; }
    public int Score { get; set; }
    public string Comment { get; set; }
    public int AttemptNumber { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime LastEditedAt { get; set; }
}