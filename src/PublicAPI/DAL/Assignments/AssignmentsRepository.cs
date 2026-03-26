using Domain.Assignments;
using Domain.Assignments.DTO;
using Microsoft.EntityFrameworkCore;

namespace DAL.Assignments;

public class AssignmentsRepository(
    DataContext dataContext
) : IAssignmentsRepository
{
    private DbSet<AssignmentEntity> Assignments => dataContext.Assignments;
    private IQueryable<AssignmentEntity> AssignmentsSearch => Assignments.AsNoTracking();
    private IQueryable<AssignmentEntity> AssignmentsFullSearch => AssignmentsFull.AsNoTracking();
    private IQueryable<AssignmentEntity> AssignmentsFull => Assignments
        .Include(e => e.Employer)
        .Include(e => e.Technologies);
    
    
    public async Task<Assignment?> Get(Guid id)
    {
        var assignment = await AssignmentsSearch.FirstOrDefaultAsync(x => x.Id == id);
        return assignment == null 
            ? null
            : AssignmentsMapper.ToDomain(assignment);
    }

    public async Task<(Assignment task, Guid employerId)?> GetWithOwner(Guid id)
    {
        var assignment = await AssignmentsSearch.FirstOrDefaultAsync(x => x.Id == id);
        return assignment == null 
            ? null
            : (AssignmentsMapper.ToDomain(assignment), assignment.EmployerId);
    }

    public async Task<AssignmentFullInfo?> GetFull(Guid id)
    {
        var assignment = await AssignmentsFullSearch.FirstOrDefaultAsync(x => x.Id == id);
        return assignment == null 
            ? null
            : AssignmentsMapper.ToDomainFull(assignment);
    }

    public async Task<AssignmentSearchResponse> Search(AssignmentSearchRequest request)
    {
        var query = AssignmentsFullSearch;
        
        if (request.EmployerId != null)
            query = query.Where(x => x.EmployerId == request.EmployerId);
        if (request.Text != null) 
            query = query.Where(e => EF.Functions.ILike(e.Name, $"%{request.Text}%"));
        
        var count = await query.CountAsync();
        return new(
            query.Skip(request.Skip).Take(request.Take).AsEnumerable().Select(AssignmentsMapper.ToDomainFull).ToArray(), 
            count);
    }

    public async Task<AssignmentFullInfo> Add(AssignmentCreateEntity createEntity)
    {
        var newEntity = AssignmentsMapper.ToEntity(createEntity);
        dataContext.Employers.Attach(newEntity.Employer); 
        dataContext.Technologies.AttachRangeIfNotEmpty(newEntity.Technologies);
        await Assignments.AddAsync(newEntity);
        await dataContext.SaveChangesAsync();
        return (await GetFull(newEntity.Id))!;
    }

    public async Task<AssignmentFullInfo> Update(Guid id, AssignmentUpdateEntity updateEntity)
    {
        var existed = await Assignments.FirstAsync(e => e.Id == id);

        if (updateEntity.Name != null)
            existed.Name = updateEntity.Name;
        if (updateEntity.Description != null)
            existed.Description = updateEntity.Description;
        if (updateEntity.TemplateUrl != null)
            existed.TemplateUrl = updateEntity.TemplateUrl.Value;
        if (updateEntity.DeadLine != null)
            existed.DeadLine = updateEntity.DeadLine.Value;
        if (updateEntity.CandidatesCapacity != null)
            existed.CandidatesCapacity = updateEntity.CandidatesCapacity.Value;
        if (updateEntity.Technologies is { } relationsPatch)
        {
            relationsPatch.ApplyRemove(existed.Technologies);
            (existed.Technologies, var toAdd) = relationsPatch.ApplyAdd(existed.Technologies);
            dataContext.Technologies.AttachRangeIfNotEmpty(toAdd);
        }

        await dataContext.SaveChangesAsync();
        return AssignmentsMapper.ToDomainFull(existed);
    }
}