using Domain.Solutions;
using Domain.Solutions.DTO;
using Microsoft.EntityFrameworkCore;

namespace DAL.Solutions;

public class SolutionsRepository(
    DataContext dataContext
) : ISolutionsRepository
{
    private DbSet<SolutionEntity> Solutions => dataContext.Solutions;
    private IQueryable<SolutionEntity> SolutionsSearch => Solutions.AsNoTracking();
    private IQueryable<SolutionEntity> SolutionsFullSearch => SolutionsFull.AsNoTracking();
    private IQueryable<SolutionEntity> SolutionsFull => Solutions
        .Include(e => e.Assignment)
        .Include(e => e.Candidate);

    public async Task<SolutionShortInfo?> Get(Guid id)
    {
        var entity = await SolutionsSearch.FirstOrDefaultAsync(e => e.Id == id);
        return entity != null
            ? SolutionsMapper.ToDomain(entity)
            : null;
    }

    public async Task<SolutionFullInfo?> GetFull(Guid id)
    {
        var entity = await SolutionsFullSearch.FirstOrDefaultAsync(e => e.Id == id);
        return entity != null
            ? SolutionsMapper.ToDomainFull(entity)
            : null;
    }

    public async Task<SolutionSearchResponse> Search(SolutionSearchRequest request)
    {
        var query = SolutionsFullSearch;

        if (request.AssignmentId != null)
            query = query.Where(e => e.AssignmentId == request.AssignmentId);
        if (request.CandidateId != null)
            query = query.Where(e => e.CandidateId == request.CandidateId);

        var count = await query.CountAsync();
        return new(
            query.Skip(request.Skip).Take(request.Take).AsEnumerable().Select(SolutionsMapper.ToDomainFull).ToArray(),
            count);
    }

    public async Task<SolutionFullInfo> Add(SolutionCreateEntity createEntity)
    {
        var newEntity = SolutionsMapper.ToEntity(createEntity);
        dataContext.Assignments.Attach(newEntity.Assignment);
        dataContext.Candidates.Attach(newEntity.Candidate);
        await Solutions.AddAsync(newEntity);
        await dataContext.SaveChangesAsync();
        return (await GetFull(newEntity.Id))!;
    }

    public async Task<SolutionFullInfo> Update(Guid id, SolutionPatchEntity patchEntity)
    {
        var existed = await SolutionsFull.FirstAsync(e => e.Id == id);

        if (patchEntity.SolutionUrl != null)
            existed.SolutionUrl = patchEntity.SolutionUrl;
        if (patchEntity.State != null)
            existed.State = SolutionsMapper.ToEntity(patchEntity.State.Value);

        await dataContext.SaveChangesAsync();
        return SolutionsMapper.ToDomainFull(existed);
    }
}
