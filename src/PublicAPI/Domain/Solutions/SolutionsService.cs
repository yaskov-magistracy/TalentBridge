using Domain.Solutions.DTO;
using Infrastructure.Results;

namespace Domain.Solutions;

public interface ISolutionsService
{
    Task<Result<SolutionFullInfo>> Get(Guid id);
    Task<Result<SolutionSearchResponse>> Search(SolutionSearchRequest request);
    Task<Result<SolutionFullInfo>> Add(SolutionCreateRequest request);
    Task<Result<SolutionFullInfo>> Update(Guid candidateId, Guid id, SolutionPatchRequest request);
    Task<Result<SolutionFullInfo>> SendToReview(Guid candidateId, Guid id);
}

public class SolutionsService(
    ISolutionsRepository solutionsRepository
) : ISolutionsService
{
    public async Task<Result<SolutionFullInfo>> Get(Guid id)
    {
        var solution = await solutionsRepository.GetFull(id);
        if (solution == null)
            return Results.NotFound<SolutionFullInfo>();
        
        return Results.Ok(solution);
    }

    public async Task<Result<SolutionSearchResponse>> Search(SolutionSearchRequest request)
    {
        var searchResponse = await solutionsRepository.Search(request);
        return Results.Ok(searchResponse);
    }

    public async Task<Result<SolutionFullInfo>> Add(SolutionCreateRequest request)
    {
        var newSolution = await solutionsRepository.Add(new(
            null,
            DateOnly.FromDateTime(DateTime.UtcNow),
            SolutionState.InProgress,
            request.EmployerTaskId,
            request.CandidateId));
        return Results.Ok(newSolution);
    }

    public async Task<Result<SolutionFullInfo>> Update(Guid candidateId, Guid id, SolutionPatchRequest request)
    {
        var existing = await solutionsRepository.Get(id);
        if (existing == null)
            return Results.NotFound<SolutionFullInfo>();
        if (existing.CandidateId != candidateId)
            return Results.Forbidden<SolutionFullInfo>();
        
        var updated = await solutionsRepository
            .Update(id, new(SolutionUrl: request.SolutionUrl));
        return Results.Ok(updated);
    }

    public async Task<Result<SolutionFullInfo>> SendToReview(Guid candidateId, Guid id)
    {
        var existing = await solutionsRepository.Get(id);
        if (existing == null)
            return Results.NotFound<SolutionFullInfo>();
        if (existing.CandidateId != candidateId)
            return Results.Forbidden<SolutionFullInfo>();
        if (existing.State != SolutionState.InProgress || existing.State != SolutionState.Reopened)
            return Results.BadRequest<SolutionFullInfo>($"State of Solution is incorrect: {existing.State}");

        var updated = await solutionsRepository
            .Update(id, new(State: SolutionState.Autotests));
        return Results.Ok(updated);
    }
}
