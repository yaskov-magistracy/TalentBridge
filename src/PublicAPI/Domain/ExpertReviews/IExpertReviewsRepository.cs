using Domain.ExpertReviews.DTO;

namespace Domain.ExpertReviews;

public interface IExpertReviewsRepository
{
    public Task<ExpertReview?> Get(Guid id);
    public Task Create(ExpertReviewCreateEntity createEntity);
    public Task Patch(Guid id, ExpertReviewPatchEntity patchEntity);
}