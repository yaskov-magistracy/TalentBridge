using Domain.Employers;
using Domain.Employers.DTO;
using Microsoft.EntityFrameworkCore;

namespace DAL.Employers;

public class EmployersRepository(
    DataContext dataContext
    ) : IEmployersRepository
{
    private DbSet<EmployerEntity> Employers => dataContext.Employers;
    
    public async Task<Employer?> Get(Guid id)
    {
        var entity = await Employers.FirstOrDefaultAsync(e => e.Id == id);
        return entity != null
            ? EmployersMapper.ToDomain(entity)
            : null;
    }

    public async Task<Employer?> Get(string login)
    {
        var entity = await Employers.FirstOrDefaultAsync(e => e.Login == login);
        return entity != null
            ? EmployersMapper.ToDomain(entity)
            : null;
    }

    public async Task<Employer> Add(EmployerCreateEntity createEntity)
    {
        var newEntity = EmployersMapper.ToEntity(createEntity);
        await dataContext.AddAsync(newEntity);
        await dataContext.SaveChangesAsync();
        return EmployersMapper.ToDomain(newEntity);
    }

    public async Task<Employer> Update(Guid id, EmployerUpdateEntity updateEntity)
    {
        var existed = await Employers.FirstAsync(e => e.Id == id);

        if (updateEntity.PasswordHash != null)
            existed.PasswordHash = updateEntity.PasswordHash;

        await dataContext.SaveChangesAsync();
        return EmployersMapper.ToDomain(existed);
    }
}