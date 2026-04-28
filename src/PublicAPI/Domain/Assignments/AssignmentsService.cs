using Domain.Assignments.DTO;
using Domain.Employers;
using Domain.Solutions;
using Infrastructure.Results;

namespace Domain.Assignments;

public interface IAssignmentsService
{
    Task<Result<AssignmentFullInfo>> Get(Guid id);
    Task<Result<AssignmentSearchResponse>> Search(AssignmentSearchRequest request);
    Task<Result<AssignmentFullInfo>> Add(AssignmentCreateEntity createEntity);
    Task<Result<AssignmentFullInfo>> Update(Guid employerId, Guid id, AssignmentPatchEntity patchEntity);
    Task<Result<AssignmentQuotaResponse>> GetQuota(Guid id);
}

public class AssignmentsService(
    IAssignmentsRepository assignmentsRepository,
    ISolutionsRepository solutionsRepository
) : IAssignmentsService
{
    public async Task<Result<AssignmentFullInfo>> Get(Guid id)
    {
        var assignment = await assignmentsRepository.GetFull(id);
        if (assignment == null)
            return Results.NotFound<AssignmentFullInfo>();
        
        return Results.Ok(assignment);
    }

    public async Task<Result<AssignmentSearchResponse>> Search(AssignmentSearchRequest request)
    {
        var searchResponse = await assignmentsRepository.Search(request);
        return Results.Ok(searchResponse);
    }

    public async Task<Result<AssignmentFullInfo>> Add(AssignmentCreateEntity createEntity)
    {
        if (createEntity.CandidatesCapacity < 1)
            return Results.BadRequest<AssignmentFullInfo>($"{nameof(createEntity.CandidatesCapacity)} can not be less then 1");
        
        var newTask = await assignmentsRepository.Add(createEntity);
        return Results.Ok(newTask);
    }

    public async Task<Result<AssignmentFullInfo>> Update(Guid employerId, Guid id, AssignmentPatchEntity patchEntity)
    {
        var pair = await assignmentsRepository.GetWithOwner(id);
        if (pair == null)
            return Results.NotFound<AssignmentFullInfo>();
        if (pair.Value.employerId != employerId)
            return Results.Forbidden<AssignmentFullInfo>();
        if (patchEntity.CandidatesCapacity < 1)
            return Results.BadRequest<AssignmentFullInfo>($"{nameof(patchEntity.CandidatesCapacity)} can not be less than 1");
        if (patchEntity.AttemptsCoefficients?.Any(e => e < 0 || e > 1) is true)
            return Results.BadRequest<AssignmentFullInfo>($"{nameof(patchEntity.AttemptsCoefficients)} should be in range (0:1]");
        
        var updated = await assignmentsRepository.Update(id, patchEntity);
        return Results.Ok(updated);
    }

    public async Task<Result<AssignmentQuotaResponse>> GetQuota(Guid id)
    {
        const float medalMaxCountPercente = 0.15f;
        var solutionsWithMedals = await solutionsRepository.Search(new()
        {
            AssignmentId = id,
            HasMedal = true,
        });
        var totalSolutions = await solutionsRepository.Search(new()
        {
            AssignmentId = id,
        });
        var totalSolutionsWithCur = totalSolutions.TotalCount + 1;
        var medalsToGrantLimit = (int)MathF.Ceiling(totalSolutionsWithCur * medalMaxCountPercente);
        var medalsToGrantLeft = medalsToGrantLimit - solutionsWithMedals.TotalCount;
        return Results.Ok(new AssignmentQuotaResponse(medalsToGrantLeft, medalsToGrantLimit));
    }
}