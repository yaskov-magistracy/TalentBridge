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
        var entity = await Candidates.FirstOrDefaultAsync(e => e.Id == id);
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
        var entity = await Candidates.FirstOrDefaultAsync(e => e.Login == login);
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

    public async Task<CandidateFullInfo> Add(CandidateCreateEntity createEntity)
    {
        var newEntity = CandidatesMapper.ToEntity(createEntity);
        dataContext.Technologies.AttachRangeIfNotEmpty(newEntity.Technologies);
        await dataContext.AddAsync(newEntity);
        await dataContext.SaveChangesAsync();
        return CandidatesMapper.ToDomainFull(newEntity);
    }

    public async Task<CandidateFullInfo> Update(Guid id, CandidateUpdateEntity updateEntity)
    {
        var existed = await CandidatesFull.FirstAsync(e => e.Id == id);

        if (updateEntity.PasswordHash != null)
            existed.PasswordHash = updateEntity.PasswordHash;
        if (updateEntity.Surname != null)
            existed.Surname = updateEntity.Surname;
        if (updateEntity.Name != null)
            existed.Name = updateEntity.Name;
        if (updateEntity.Patronymic != null)
            existed.Patronymic = updateEntity.Patronymic.Value;
        if (updateEntity.City != null)
            existed.City = updateEntity.City;
        if (updateEntity.About != null)
            existed.About = updateEntity.About;
        if (updateEntity.Technologies is {} relationsPatch)
        {
            relationsPatch.ApplyRemove(existed.Technologies);
            (existed.Technologies, var toAdd) = relationsPatch.ApplyAdd(existed.Technologies);
            dataContext.Technologies.AttachRangeIfNotEmpty(toAdd);
        }

        await dataContext.SaveChangesAsync();
        return CandidatesMapper.ToDomainFull(existed);
    }
}