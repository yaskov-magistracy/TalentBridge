using Domain.Experts;
using Domain.Solutions;

namespace Domain.ExpertReviews;

public record ExpertReview(
    Guid Id,
    Expert Expert,
    Solution Solution,
    string Comment,
    int Score,
    int AttemptNumber,
    DateTime CreatedAt,
    DateTime LastEditedAt)
{
}

public record ExpertReviewInSolution(
    Guid Id,
    Expert Expert,
    string Comment,
    int Score,
    int AttemptNumber,
    DateTime CreatedAt,
    DateTime LastEditedAt
);