namespace Domain.ExpertReviews.DTO;

public record ExpertReviewCreateRequest(
    Guid ExpertId,
    Guid SolutionId,
    string Comment,
    int Score)
{
    
}