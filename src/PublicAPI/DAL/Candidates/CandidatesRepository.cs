using System.Linq.Expressions;
using DAL.Solutions;
using Domain.Candidates;
using Domain.Candidates.DTO;
using Infrastructure.DTO.Search.Ordering;
using Microsoft.EntityFrameworkCore;

namespace DAL.Candidates;

public class CandidatesRepository(
    DataContext dataContext
    ) : ICandidatesRepository
{
    private DbSet<CandidateEntity> Candidates => dataContext.Candidates;
    private IQueryable<CandidateEntity> CandidatesSearch => Candidates.AsNoTracking();
    private IQueryable<CandidateEntity> CandidatesFullSearch => CandidatesFull.AsNoTracking();
    private IQueryable<CandidateEntity> CandidatesFull => Candidates
        .Include(e => e.Technologies)
        .Include(e => e.Solutions)!.ThenInclude(s => s.Assignment)
        .Include(e => e.Solutions)!.ThenInclude(s => s.ExpertReviews);
    
    public async Task<Candidate?> Get(Guid id)
    {
        var entity = await CandidatesSearch.FirstOrDefaultAsync(e => e.Id == id);
        return entity != null
            ? CandidatesMapper.ToDomain(entity)
            : null;
    }

    public async Task<CandidateFullInfo?> GetFull(Guid id)
    {
        var entity = await CandidatesFullSearch.FirstOrDefaultAsync(e => e.Id == id);
        return entity != null
            ? CandidatesMapper.ToDomainFull(entity)
            : null;
    }

    public async Task<Candidate?> Get(string login)
    {
        var entity = await CandidatesSearch.FirstOrDefaultAsync(e => e.Login == login);
        return entity != null
            ? CandidatesMapper.ToDomain(entity)
            : null;
    }

    public async Task<CandidateFullInfo?> GetFull(string login)
    {
        var entity = await CandidatesFullSearch.FirstOrDefaultAsync(e => e.Login == login);
        return entity != null
            ? CandidatesMapper.ToDomainFull(entity)
            : null;
    }

    public async Task<CandidateSearchResponse> Search(CandidateSearchRequest request)
    {
        var query = CandidatesFullSearch;

        if (request.TechnologiesIds != null)
            query = query.Where(e => request.TechnologiesIds.All(t => e.Technologies!.Any(t2 => t2.Id == t)));
        if (request.Ordering is {} ordering)
        {
            
            if (ordering.Field == CandidateSearchOrderingField.Rating)
            {
                query = query.OrderByDirection(
                    e => e.Rating,
                    ordering.Direction);
            }
            else if (ordering.Field == CandidateSearchOrderingField.SolutionsCompleted)
            {
                query = query.OrderByDirection(
                    e => e.Solutions!.Count(s => s.State == SolutionEntityState.Done),
                    ordering.Direction);
            }
            else if (ordering.Field == CandidateSearchOrderingField.SuccessRate)
            {
                Expression<Func<CandidateEntity, float>> selector = e => 
                    e.Solutions!.Count(s => s.State == SolutionEntityState.Failed) == 0 
                        ? e.Solutions!.Count(s => s.State == SolutionEntityState.Done) == 0 ? 0f : 100f
                        : (float)e.Solutions!.Count(s => s.State == SolutionEntityState.Done) 
                          / e.Solutions!.Count(s => s.State == SolutionEntityState.Failed);
                query = query.OrderByDirection(
                    selector,
                    ordering.Direction);
            }
            else
            {
                throw new ArgumentException($"Ordering field {ordering.Field} is not supported");
            }
        }
        
        var count = await query.CountAsync();
        return new(
            query.Skip(request.Skip).Take(request.Take).AsEnumerable().Select(CandidatesMapper.ToDomainFull).ToArray(),
            count);
    }

    public async Task<Guid> Create(CandidateCreateEntity createEntity)
    {
        var newEntity = CandidatesMapper.ToEntity(createEntity);
        dataContext.Technologies.AttachRangeIfNotEmpty(newEntity.Technologies);
        await dataContext.AddAsync(newEntity);
        await dataContext.SaveChangesAsync();
        return newEntity.Id;
    }

    public async Task Patch(Guid id, CandidatePatchEntity patchEntity)
    {
        var existed = await CandidatesFull.FirstAsync(e => e.Id == id);

        if (patchEntity.PasswordHash != null)
            existed.PasswordHash = patchEntity.PasswordHash;
        if (patchEntity.Surname != null)
            existed.Surname = patchEntity.Surname;
        if (patchEntity.Name != null)
            existed.Name = patchEntity.Name;
        if (patchEntity.Patronymic != null)
            existed.Patronymic = patchEntity.Patronymic.Value;
        if (patchEntity.City != null)
            existed.City = patchEntity.City;
        if (patchEntity.About != null)
            existed.About = patchEntity.About;
        if (patchEntity.Rating != null)
            existed.Rating = patchEntity.Rating.Value;
        if (patchEntity.Technologies is {} relationsPatch)
        {
            relationsPatch.ApplyRemove(existed.Technologies);
            (existed.Technologies, var toAdd) = relationsPatch.ApplyAdd(existed.Technologies);
            dataContext.Technologies.AttachRangeIfNotEmpty(toAdd);
        }

        await dataContext.SaveChangesAsync();
    }
}