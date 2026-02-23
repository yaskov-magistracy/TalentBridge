using Domain.Authorization.DTO;

namespace Domain.Authorization;

public interface IAccountsRepository
{
    Task<Account?> GetCandidate(Guid id);
    Task<Account?> GetCandidate(string login);
    Task<Account?> GetEmployer(Guid id);
    Task<Account?> GetEmployer(string login);
    Task<Account?> Find(string login);
}