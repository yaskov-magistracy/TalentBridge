using Domain.ExpertReviews;
using Domain.ExpertReviews.DTO;
using Microsoft.EntityFrameworkCore;

namespace DAL.ExpertReviews;

public class ExpertReviewsRepository(
    DataContext dataContext
) : IExpertReviewsRepository
{
    private DbSet<ExpertReviewEntity> ExpertReviews => dataContext.ExpertReviews;
    private IQueryable<ExpertReviewEntity> ExpertReviewsSearch => ExpertReviews.AsNoTracking();
    private IQueryable<ExpertReviewEntity> ExpertReviewsFullSearch => ExpertReviews.AsNoTracking();
    private IQueryable<ExpertReviewEntity> ExpertReviewsFull => ExpertReviews
        .Include(e => e.Expert)
        .Include(e => e.Solution);
    
    public async Task<ExpertReview?> Get(Guid id)
    {
        var entity = await ExpertReviewsFullSearch.FirstOrDefaultAsync(e => e.Id == id);
        return entity != null
            ? ExpertReviewsMapper.ToDomain(entity)
            : null;
    }

    public async Task Create(ExpertReviewCreateEntity createEntity)
    {
        var entity = ExpertReviewsMapper.ToEntity(createEntity);
        dataContext.Solutions.Attach(entity.Solution);
        dataContext.Experts.Attach(entity.Expert);
        ExpertReviews.Add(entity);
        await dataContext.SaveChangesAsync();
    }

    public async Task Patch(Guid id, ExpertReviewPatchEntity patchEntity)
    {
        var existed = ExpertReviews.First(e => e.Id == id);

        if (patchEntity.Comment != null)
            existed.Comment = patchEntity.Comment;

        await dataContext.SaveChangesAsync();
    }
}