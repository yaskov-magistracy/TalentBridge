using DAL.Candidates;
using DAL.Employers;
using Domain.Authorization;
using Microsoft.EntityFrameworkCore;

namespace DAL.Authorization;

public class AccountsRepository(
    DataContext dataContext
) : IAccountsRepository
{
    private DbSet<CandidateEntity> Candidates => dataContext.Candidates;
    private DbSet<EmployerEntity> Employers => dataContext.Employers;
    
    
    public async Task<Account?> GetCandidate(Guid id)
    {
        var entity = await Candidates.FirstOrDefaultAsync(e => e.Id == id);
        return entity != null 
            ? new Account(entity.Id, entity.Login, entity.PasswordHash, AccountRole.Candidate)
            : null;
    }

    public async Task<Account?> GetCandidate(string login)
    {
        var entity = await Candidates.FirstOrDefaultAsync(e => e.Login == login);
        return entity != null 
            ? new Account(entity.Id, entity.Login, entity.PasswordHash, AccountRole.Candidate)
            : null;
    }

    public async Task<Account?> GetEmployer(Guid id)
    {
        var entity = await Employers.FirstOrDefaultAsync(e => e.Id == id);
        return entity != null 
            ? new Account(entity.Id, entity.Login, entity.PasswordHash, AccountRole.Employer)
            : null;
    }

    public async Task<Account?> GetEmployer(string login)
    {
        var entity = await Employers.FirstOrDefaultAsync(e => e.Login == login);
        return entity != null 
            ? new Account(entity.Id, entity.Login, entity.PasswordHash, AccountRole.Employer)
            : null;
    }

    public async Task<Account?> Find(string login)
    {
        return await GetCandidate(login) 
               ?? await GetEmployer(login);
    }
}