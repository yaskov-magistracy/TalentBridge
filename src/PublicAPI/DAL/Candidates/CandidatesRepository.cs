using DAL.Technologies;
using Domain.Candidates;
using Domain.Candidates.DTO;
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
        .Include(e => e.Technologies);
    
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

    public async Task<CandidateFullInfo> Create(CandidateCreateEntity createEntity)
    {
        var newEntity = CandidatesMapper.ToEntity(createEntity);
        dataContext.Technologies.AttachRangeIfNotEmpty(newEntity.Technologies);
        await dataContext.AddAsync(newEntity);
        await dataContext.SaveChangesAsync();
        return CandidatesMapper.ToDomainFull(newEntity);
    }

    public async Task<CandidateFullInfo> Patch(Guid id, CandidatePatchEntity patchEntity)
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
        return CandidatesMapper.ToDomainFull(existed);
    }
}