using Domain.ExpertReviews.DTO;
using Infrastructure.Results;

namespace Domain.ExpertReviews;

public interface IExpertReviewsService
{
    Task<Result<ExpertReview>> Get(Guid id);
    Task<Result<ExpertReview>> Patch(Guid expertId, Guid id, ExpertReviewPatchEntity patchRequest);
}

public class ExpertReviewsService(
    IExpertReviewsRepository expertReviewsRepository
) : IExpertReviewsService
{
    public async Task<Result<ExpertReview>> Get(Guid id)
    {
        var expertReview = await expertReviewsRepository.Get(id);
        if (expertReview == null)
            return Results.NotFound<ExpertReview>("Expert review not found");
        
        return Results.Ok(expertReview);
    }

    public async Task<Result<ExpertReview>> Patch(Guid expertId, Guid id, ExpertReviewPatchEntity patchRequest)
    {
        var expertReview = await expertReviewsRepository.Get(id);
        if (expertReview == null)
            return Results.NotFound<ExpertReview>("Expert review not found");
        if (expertReview.Expert.Id != expertId)
            return Results.Forbidden<ExpertReview>($"Expert has not access to review: {expertReview.Id}");

        await expertReviewsRepository.Patch(id, patchRequest);
        var updated = await expertReviewsRepository.Get(id);
        return Results.Ok(updated!);
    }
}