using Domain.Employers.DTO;

namespace Domain.Employers;

public interface IEmployersRepository
{
    public Task<Employer?> Get(Guid id);
    public Task<Employer?> Get(string login);
    public Task<Employer> Add(EmployerCreateEntity createEntity);
    public Task<Employer> Update(Guid id, EmployerUpdateEntity updateEntity);
}