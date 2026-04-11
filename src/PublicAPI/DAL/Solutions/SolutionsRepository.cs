using DAL.Candidates;
using DAL.Experts;
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
        .Include(e => e.Candidates)
        .Include(e => e.CandidatesJoinRequested)
        .Include(e => e.Expert);

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
        if (request.TechnologiesIds != null)
            query = query.Where(e => request.TechnologiesIds.All(t => e.Assignment.Technologies!.Any(t2 => t2.Id == t)));
        if (request.ExcludeAssignmentsIds != null)
            query = query.Where(e => !request.ExcludeAssignmentsIds.Contains(e.AssignmentId));
        if (request.CandidateId != null)
            query = query.Where(e => e.Candidates.Any(c => c.Id == request.CandidateId));
        if (request.ExcludeCandidateId != null)
            query = query.Where(e => e.Candidates.All(c => c.Id != request.ExcludeCandidateId));
        if (request.CandidateOwnerId != null)
            query = query.Where(e => e.CandidateOwnerId == request.CandidateOwnerId);
        if (request.ExcludeCandidateOwnerId != null)
            query = query.Where(e => e.CandidateOwnerId != request.ExcludeCandidateOwnerId);
        if (request.CandidateJoinRequestedId != null)
            query = query.Where(e => e.CandidatesJoinRequested!.Any(c => c.Id == request.CandidateJoinRequestedId));
        if (request.ExcludeCandidateJoinRequestedId != null)
            query = query.Where(e => e.CandidatesJoinRequested!.All(c => c.Id != request.ExcludeCandidateJoinRequestedId));
        if (request.IsAvailableToJoin is true)
            query = query.Where(e => e.Candidates.Count < e.Assignment.CandidatesCapacity);
        if (request.IsAvailableToJoin is false)
            query = query.Where(e => e.Candidates.Count == e.Assignment.CandidatesCapacity);
        
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
        if (patchEntity.Candidates is {} candidatesRelationsPatch)
        {
            candidatesRelationsPatch.ApplyRemove(existed.Candidates);
            (existed.Candidates, var toAdd) = candidatesRelationsPatch.ApplyAdd(existed.Candidates);
            for (int i = 0; i < existed.Candidates.Count; i++)
            {
                var alreadyAttached =
                    existed.CandidatesJoinRequested?.FirstOrDefault(e => e.Id == existed.Candidates[i].Id);
                if (alreadyAttached == null)
                    continue;
                
                toAdd.RemoveAt(toAdd.FindIndex(e => e.Id == alreadyAttached.Id));
                existed.Candidates[i] = alreadyAttached;
            }
            dataContext.Candidates.AttachRangeIfNotEmpty(toAdd);
        }
        if (patchEntity.CandidatesJoinRequested is { } candidateJoinRequestedRelationsPatch)
        {
            candidateJoinRequestedRelationsPatch.ApplyRemove(existed.CandidatesJoinRequested);
            (existed.CandidatesJoinRequested, var toAdd) = candidateJoinRequestedRelationsPatch.ApplyAdd(existed.CandidatesJoinRequested);
            dataContext.Candidates.AttachRangeIfNotEmpty(toAdd);
        }
        if (patchEntity.ExpertReview != null)
            existed.ExpertReview = patchEntity.ExpertReview;
        if (patchEntity.ExpertId != null)
        {
            existed.Expert = new ExpertEntity(){Id = patchEntity.ExpertId.Value};
            dataContext.Experts.Attach(existed.Expert);
        }

        await dataContext.SaveChangesAsync();
        return SolutionsMapper.ToDomainFull(existed);
    }
}
