using Domain.EmployerTasks;
using Domain.EmployerTasks.DTO;
using Microsoft.EntityFrameworkCore;

namespace DAL.EmployerTasks;

public class EmployerTaskRepository(
    DataContext dataContext
) : IEmployerTasksRepository
{
    private DbSet<EmployerTaskEntity> EmployerTasks => dataContext.EmployerTasks;
    private IQueryable<EmployerTaskEntity> EmployerTasksSearch => EmployerTasks.AsNoTracking();
    
    public async Task<EmployerTask?> Get(Guid id)
    {
        var employerTask = await EmployerTasksSearch.FirstOrDefaultAsync(x => x.Id == id);
        return employerTask == null 
            ? null
            : EmployerTasksMapper.ToDomain(employerTask);
    }

    public async Task<EmployerTaskSearchResponse> Search(EmployerTaskSearchRequest request)
    {
        var query = EmployerTasksSearch;
        
        if (request.EmployerId != null)
            query = query.Where(x => x.EmployerId == request.EmployerId);
        if (request.Text != null) // TODO полнотекстовый поиск 
            query = query.Where(x => x.Name.Contains(request.Text));
        
        var count = await query.CountAsync();
        return new(
            query.Skip(request.Skip).Take(request.Take).AsEnumerable().Select(EmployerTasksMapper.ToDomain).ToArray(), 
            count);
    }

    public async Task<EmployerTask> Add(EmployerTaskCreateEntity createEntity)
    {
        var newEntity = EmployerTasksMapper.ToEntity(createEntity);
        await EmployerTasks.AddAsync(newEntity);
        await dataContext.SaveChangesAsync();
        return EmployerTasksMapper.ToDomain(newEntity);
    }

    public async Task<EmployerTask> Update(Guid id, EmployerTaskUpdateEntity updateEntity)
    {
        var existed = await EmployerTasks.FirstAsync(e => e.Id == id);

        if (updateEntity.Name != null)
            existed.Name = updateEntity.Name;
        if (updateEntity.Description != null)
            existed.Description = updateEntity.Description;
        if (updateEntity.TemplateUrl != null)
            existed.TemplateUrl = updateEntity.TemplateUrl.Value;
        if (updateEntity.DeadLine != null)
            existed.DeadLine = updateEntity.DeadLine.Value;

        await dataContext.SaveChangesAsync();
        return EmployerTasksMapper.ToDomain(existed);
    }
}