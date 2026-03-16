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
    private IQueryable<EmployerTaskEntity> EmployerTasksFullSearch => EmployerTasksFull.AsNoTracking();
    private IQueryable<EmployerTaskEntity> EmployerTasksFull => EmployerTasks
        .Include(e => e.Employer)
        .Include(e => e.Technologies);
    
    
    public async Task<EmployerTask?> Get(Guid id)
    {
        var employerTask = await EmployerTasksSearch.FirstOrDefaultAsync(x => x.Id == id);
        return employerTask == null 
            ? null
            : EmployerTasksMapper.ToDomain(employerTask);
    }

    public async Task<(EmployerTask task, Guid employerId)?> GetWithOwner(Guid id)
    {
        var employerTask = await EmployerTasksSearch.FirstOrDefaultAsync(x => x.Id == id);
        return employerTask == null 
            ? null
            : (EmployerTasksMapper.ToDomain(employerTask), employerTask.EmployerId);
    }

    public async Task<EmployerTaskFullInfo?> GetFull(Guid id)
    {
        var employerTask = await EmployerTasksFullSearch.FirstOrDefaultAsync(x => x.Id == id);
        return employerTask == null 
            ? null
            : EmployerTasksMapper.ToDomainFull(employerTask);
    }

    public async Task<EmployerTaskSearchResponse> Search(EmployerTaskSearchRequest request)
    {
        var query = EmployerTasksFullSearch;
        
        if (request.EmployerId != null)
            query = query.Where(x => x.EmployerId == request.EmployerId);
        if (request.Text != null) 
            query = query.Where(e => EF.Functions.ILike(e.Name, $"%{request.Text}%"));
        
        var count = await query.CountAsync();
        return new(
            query.Skip(request.Skip).Take(request.Take).AsEnumerable().Select(EmployerTasksMapper.ToDomainFull).ToArray(), 
            count);
    }

    public async Task<EmployerTaskFullInfo> Add(EmployerTaskCreateEntity createEntity)
    {
        var newEntity = EmployerTasksMapper.ToEntity(createEntity);
        dataContext.Employers.Attach(newEntity.Employer); 
        dataContext.Technologies.AttachRangeIfNotEmpty(newEntity.Technologies);
        await EmployerTasks.AddAsync(newEntity);
        await dataContext.SaveChangesAsync();
        return (await GetFull(newEntity.Id))!;
    }

    public async Task<EmployerTaskFullInfo> Update(Guid id, EmployerTaskUpdateEntity updateEntity)
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
        if (updateEntity.Technologies is { } relationsPatch)
        {
            relationsPatch.ApplyRemove(existed.Technologies);
            (existed.Technologies, var toAdd) = relationsPatch.ApplyAdd(existed.Technologies);
            dataContext.Technologies.AttachRangeIfNotEmpty(toAdd);
        }

        await dataContext.SaveChangesAsync();
        return EmployerTasksMapper.ToDomainFull(existed);
    }
}