using Domain.Experts;
using Domain.Experts.DTO;
using Microsoft.EntityFrameworkCore;

namespace DAL.Experts;

public class ExpertsRepository(
    DataContext dataContext
) : IExpertsRepository
{
    private DbSet<ExpertEntity> Experts => dataContext.Experts;
    private IQueryable<ExpertEntity> ExpertsSearch => Experts.AsNoTracking();
    private IQueryable<ExpertEntity> ExpertsFullSearch => ExpertsFull.AsNoTracking();
    private IQueryable<ExpertEntity> ExpertsFull => Experts
        .Include(e => e.Employer);
    
    public async Task<Expert?> Get(Guid id)
    {
        var entity = await ExpertsSearch.FirstOrDefaultAsync(e => e.Id == id);
        return entity != null
            ? ExpertsMapper.ToDomain(entity)
            : null;
    }
    
    public async Task<ExpertFullInfo?> GetFull(Guid id)
    {
        var entity = await ExpertsFullSearch.FirstOrDefaultAsync(e => e.Id == id);
        return entity != null
            ? ExpertsMapper.ToDomainFull(entity)
            : null;
    }

    public async Task<Expert?> Get(string login)
    {
        var entity = await ExpertsSearch.FirstOrDefaultAsync(e => e.Login == login);
        return entity != null
            ? ExpertsMapper.ToDomain(entity)
            : null;
    }

    public async Task<Expert> Add(ExpertCreateEntity createEntity)
    {
        var newEntity = ExpertsMapper.ToEntity(createEntity);
        dataContext.Employers.Attach(newEntity.Employer);
        await dataContext.AddAsync(newEntity);
        await dataContext.SaveChangesAsync();
        return ExpertsMapper.ToDomain(newEntity);
    }

    public async Task<Expert> Update(Guid id, ExpertUpdateEntity updateEntity)
    {
        var existed = await ExpertsFull.FirstAsync(e => e.Id == id);

        if (updateEntity.PasswordHash != null)
            existed.PasswordHash = updateEntity.PasswordHash;
        if (updateEntity.Surname != null)
            existed.Surname = updateEntity.Surname;
        if (updateEntity.Name != null)
            existed.Name = updateEntity.Name;
        if (updateEntity.Patronymic != null)
            existed.Patronymic = updateEntity.Patronymic.Value;

        await dataContext.SaveChangesAsync();
        return ExpertsMapper.ToDomain(existed);
    }
}