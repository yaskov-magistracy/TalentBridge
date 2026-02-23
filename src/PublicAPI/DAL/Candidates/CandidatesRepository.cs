using Domain.Candidates;
using Domain.Candidates.DTO;
using Microsoft.EntityFrameworkCore;

namespace DAL.Candidates;

public class CandidatesRepository(
    DataContext dataContext
    ) : ICandidatesRepository
{
    private DbSet<CandidateEntity> Candidates => dataContext.Candidates;
    
    public async Task<Candidate?> Get(Guid id)
    {
        var entity = await Candidates.FirstOrDefaultAsync(e => e.Id == id);
        return entity != null
            ? CandidatesMapper.ToDomain(entity)
            : null;
    }

    public async Task<Candidate?> Get(string login)
    {
        var entity = await Candidates.FirstOrDefaultAsync(e => e.Login == login);
        return entity != null
            ? CandidatesMapper.ToDomain(entity)
            : null;
    }

    public async Task<Candidate> Add(CandidateCreateEntity createEntity)
    {
        var newEntity = CandidatesMapper.ToEntity(createEntity);
        await dataContext.AddAsync(newEntity);
        await dataContext.SaveChangesAsync();
        return CandidatesMapper.ToDomain(newEntity);
    }

    public async Task<Candidate> Update(Guid id, CandidateUpdateEntity updateEntity)
    {
        var existed = await Candidates.FirstAsync(e => e.Id == id);

        if (updateEntity.PasswordHash != null)
            existed.PasswordHash = updateEntity.PasswordHash;

        await dataContext.SaveChangesAsync();
        return CandidatesMapper.ToDomain(existed);
    }
}