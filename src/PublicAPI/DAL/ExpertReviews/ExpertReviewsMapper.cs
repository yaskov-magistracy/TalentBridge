using DAL.Experts;
using DAL.Solutions;
using Domain.ExpertReviews;
using Domain.ExpertReviews.DTO;

namespace DAL.ExpertReviews;

internal static class ExpertReviewsMapper
{
    public static ExpertReview ToDomain(ExpertReviewEntity entity)
        => new(
            entity.Id,
            ExpertsMapper.ToDomain(entity.Expert),
            SolutionsMapper.ToDomain(entity.Solution),
            entity.Comment,
            entity.Score,
            entity.AttemptNumber,
            entity.CreatedAt,
            entity.LastEditedAt);
    
    public static ExpertReviewInSolution ToDomainInSolution(ExpertReviewEntity entity)
        => new(
            entity.Id,
            ExpertsMapper.ToDomain(entity.Expert),
            entity.Comment,
            entity.Score,
            entity.AttemptNumber,
            entity.CreatedAt,
            entity.LastEditedAt);

    public static ExpertReviewEntity ToEntity(ExpertReviewCreateEntity createEntity)
        => new()
        {
            Expert = new ExpertEntity()
            {
                Id = createEntity.ExpertId,
            },
            Solution = new SolutionEntity()
            {
                Id = createEntity.SolutionId,
            },
            Comment = createEntity.Comment,
            Score = createEntity.Score,
            AttemptNumber = createEntity.AttemptNumber,
            CreatedAt = createEntity.CreatedAt,
            LastEditedAt = createEntity.LastEditedAt,
        };
}