using Domain.Assignments;
using Domain.Solutions.DTO;
using Infrastructure.Results;

namespace Domain.Solutions;

public interface ISolutionsService
{
    Task<Result<SolutionFullInfo>> Get(Guid id);
    Task<Result<SolutionSearchResponse>> Search(SolutionSearchRequest request);
    Task<Result<SolutionFullInfo>> Add(SolutionCreateRequest request);
    Task<Result<SolutionFullInfo>> Update(Guid candidateId, Guid id, SolutionPatchRequest request);
    Task<Result<SolutionFullInfo>> Join(Guid candidateId, Guid id);
    Task<Result<SolutionFullInfo>> Start(Guid candidateId, Guid id);
    Task<Result<SolutionFullInfo>> SendToReview(Guid candidateId, Guid id);
}

public class SolutionsService(
    ISolutionsRepository solutionsRepository,
    IAssignmentsRepository assignmentsRepository
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
        var assignment = await assignmentsRepository.Get(request.AssignmentId);
        if (assignment == null)
            return Results.NotFound<SolutionFullInfo>("Assignment not found");
        if (assignment.CandidatesCapacity != 1 && request.Team == null)
            return Results.BadRequest<SolutionFullInfo>("Team is required");
        if (assignment.CandidatesCapacity == 1 && request.Team != null)
            return Results.BadRequest<SolutionFullInfo>("Team is not supported for solo Assignment");
        
        var newSolution = await solutionsRepository.Add(new(
            null,
            SolutionState.NotStarted,
            request.Team == null ? null : new(request.Team.Name, request.Team.Description),
            request.AssignmentId,
            request.CandidateOwnerId));
        return Results.Ok(newSolution);
    }

    public async Task<Result<SolutionFullInfo>> Update(Guid candidateId, Guid id, SolutionPatchRequest request)
    {
        var solution = await solutionsRepository.Get(id);
        if (solution == null)
            return Results.NotFound<SolutionFullInfo>();
        if (solution.CandidateOwnerId != candidateId)
            return Results.Forbidden<SolutionFullInfo>();
        if (request.Team != null && !solution.IsGroup)
            return Results.BadRequest<SolutionFullInfo>("Team is required");
        
        var updated = await solutionsRepository
            .Update(id, new(SolutionUrl: request.SolutionUrl));
        return Results.Ok(updated);
    }

    public async Task<Result<SolutionFullInfo>> Join(Guid candidateId, Guid id)
    {
        var solution = await solutionsRepository.GetFull(id);
        if (solution == null)
            return Results.NotFound<SolutionFullInfo>();
        if (solution.Candidates.Any(e => e.Id == candidateId))
            return Results.Ok(solution);
        
        if (solution.Assignment.CandidatesCapacity == 1)
            return Results.BadRequest<SolutionFullInfo>("Assignment is not of team type");
        if (solution.Assignment.CandidatesCapacity == solution.Candidates.Count)
            return Results.BadRequest<SolutionFullInfo>("CandidatesCapacity is full");
        
        await solutionsRepository.Update(
            id,
            new(Candidates: new(ToAdd: [candidateId])));
        var updated = await solutionsRepository.GetFull(id);
        return Results.Ok(updated!);
    }

    public async Task<Result<SolutionFullInfo>> Start(Guid candidateId, Guid id)
    {
        var solution = await solutionsRepository.Get(id);
        if (solution == null)
            return Results.NotFound<SolutionFullInfo>();
        if (solution.CandidateOwnerId != candidateId)
            return Results.Forbidden<SolutionFullInfo>("Only team leader can start Solution");
        if (solution.State != SolutionState.NotStarted)
            return Results.BadRequest<SolutionFullInfo>("Solution is already started");

        var updated = await solutionsRepository
            .Update(id, new(
                State: SolutionState.InProgress,
                StartedAt: DateOnly.FromDateTime(DateTime.UtcNow)));
        return Results.Ok(updated);
    }

    public async Task<Result<SolutionFullInfo>> SendToReview(Guid candidateId, Guid id)
    {
        var solution = await solutionsRepository.Get(id);
        if (solution == null)
            return Results.NotFound<SolutionFullInfo>();
        if (solution.CandidateOwnerId != candidateId)
            return Results.Forbidden<SolutionFullInfo>();
        if (solution.State != SolutionState.InProgress && solution.State != SolutionState.Reopened)
            return Results.BadRequest<SolutionFullInfo>($"State of Solution is incorrect: {solution.State}");

        var updated = await solutionsRepository
            .Update(id, new(State: SolutionState.Autotests));
        return Results.Ok(updated);
    }
}
