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
        if (request.ExcludedIds != null)
            query = query.Where(x => !request.ExcludedIds.Contains(x.Id));
        if (request.Text != null) 
            query = query.Where(e => EF.Functions.ILike(e.Name, $"%{request.Text}%"));
        if (request.TechnologiesIds != null)
            query = query.Where(e => request.TechnologiesIds.All(t => e.Technologies!.Any(t2 => t2.Id == t)));
        if (request.DeadLineRangeIncluded != null)
            query = query.Where(e => e.DeadLine >= request.DeadLineRangeIncluded.From
                                     && e.DeadLine <= request.DeadLineRangeIncluded.To); 
        if (request.IsGrouped is true)
            query = query.Where(e => e.CandidatesCapacity > 1);
        if (request.IsGrouped is false)
            query = query.Where(e => e.CandidatesCapacity == 1);
        
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

    public async Task<AssignmentFullInfo> Update(Guid id, AssignmentPatchEntity patchEntity)
    {
        var existed = await Assignments.FirstAsync(e => e.Id == id);

        if (patchEntity.Name != null)
            existed.Name = patchEntity.Name;
        if (patchEntity.Description != null)
            existed.Description = patchEntity.Description;
        if (patchEntity.TemplateUrl != null)
            existed.TemplateUrl = patchEntity.TemplateUrl.Value;
        if (patchEntity.DeadLine != null)
            existed.DeadLine = patchEntity.DeadLine.Value;
        if (patchEntity.CandidatesCapacity != null)
            existed.CandidatesCapacity = patchEntity.CandidatesCapacity.Value;
        if (patchEntity.Difficulty != null)
            existed.Difficulty = AssignmentsMapper.ToEntity(patchEntity.Difficulty.Value);
        if (patchEntity.AttemptsCoefficients != null)
            existed.AttemptsCoefficients = patchEntity.AttemptsCoefficients;
        if (patchEntity.MaxAttemptNumberToGrantMedal != null)
            existed.MaxAttemptNumberToGrantMedal = patchEntity.MaxAttemptNumberToGrantMedal.Value;
        if (patchEntity.Technologies is { } relationsPatch)
        {
            relationsPatch.ApplyRemove(existed.Technologies);
            (existed.Technologies, var toAdd) = relationsPatch.ApplyAdd(existed.Technologies);
            dataContext.Technologies.AttachRangeIfNotEmpty(toAdd);
        }

        await dataContext.SaveChangesAsync();
        return AssignmentsMapper.ToDomainFull(existed);
    }
}