namespace Domain.ExpertReviews.DTO;

public record ExpertReviewCreateEntity(
    Guid ExpertId,
    Guid SolutionId,
    string Comment,
    int Score,
    int AttemptNumber,
    DateTime CreatedAt,
    DateTime LastEditedAt)
{
    
}