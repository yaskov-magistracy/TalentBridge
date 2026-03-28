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
        .Include(e => e.Assignment).ThenInclude(a => a.Employer)
        .Include(e => e.Assignment).ThenInclude(a => a.Technologies)
        .Include(e => e.CandidateOwner)
        .Include(e => e.Candidates);

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

        if (request.Text != null)
            query = query.Where(e => e.Team != null
                                     && (EF.Functions.ILike(e.Team.Name, $"%{request.Text}%")
                                         || EF.Functions.ILike(e.Team.Description, $"%{request.Text}%")));
        if (request.AssignmentId != null)
            query = query.Where(e => e.AssignmentId == request.AssignmentId);
        if (request.CandidateId != null)
            query = query.Where(e => e.CandidateOwnerId == request.CandidateId);

        var count = await query.CountAsync();
        return new(
            query.Skip(request.Skip).Take(request.Take).AsEnumerable().Select(SolutionsMapper.ToDomainFull).ToArray(),
            count);
    }

    public async Task<SolutionFullInfo> Add(SolutionCreateEntity createEntity)
    {
        var newEntity = SolutionsMapper.ToEntity(createEntity);
        dataContext.Assignments.Attach(newEntity.Assignment);
        dataContext.Candidates.AttachRange(newEntity.Candidates);
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
        if (patchEntity.StartedAt != null)
            existed.StartedAt = patchEntity.StartedAt;
        if (patchEntity.Team?.Name != null)
            existed.Team!.Name = patchEntity.Team.Name;
        if (patchEntity.Team?.Description != null)
            existed.Team!.Description = patchEntity.Team.Description;
        if (patchEntity.Candidates is {} relationsPatch)
        {
            relationsPatch.ApplyRemove(existed.Candidates);
            (existed.Candidates, var toAdd) = relationsPatch.ApplyAdd(existed.Candidates);
            dataContext.Candidates.AttachRangeIfNotEmpty(toAdd);
        }

        await dataContext.SaveChangesAsync();
        return SolutionsMapper.ToDomainFull(existed);
    }
}
