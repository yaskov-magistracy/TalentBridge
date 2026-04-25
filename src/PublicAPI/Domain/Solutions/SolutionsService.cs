using Domain.Assignments;
using Domain.ExpertReviews;
using Domain.ExpertReviews.DTO;
using Domain.Experts;
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
    Task<Result<SolutionFullInfo>> JoinRequest(Guid candidateId, Guid id);
    Task<Result<SolutionFullInfo>> JoinRequestAccept(Guid candidateOwnerId, Guid candidateJoinRequestedId, Guid id);
    Task<Result<SolutionFullInfo>> Start(Guid candidateId, Guid id);
    Task<Result<SolutionFullInfo>> SendToReview(Guid candidateOwnerId, Guid id);
    Task<Result<SolutionFullInfo>> SubmitReview(Guid expertId, Guid id, SolutionSubmitReviewRequest request);
}

public class SolutionsService(
    ISolutionsRepository solutionsRepository,
    IExpertsRepository expertsRepository,
    IAssignmentsRepository assignmentsRepository,
    IExpertReviewsRepository expertReviewsRepository
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
        
        var createdId = await solutionsRepository.Create(new(
            null,
            SolutionState.NotStarted,
            request.Team == null ? null : new(request.Team.Name, request.Team.Description),
            request.AssignmentId,
            request.CandidateOwnerId));
        var created = await solutionsRepository.GetFull(createdId);
        return Results.Ok(created!);
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
        
        await solutionsRepository
            .Patch(id, new(SolutionUrl: request.SolutionUrl));
        var updated = await solutionsRepository.GetFull(id);
        return Results.Ok(updated!);
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
        
        await solutionsRepository.Patch(
            id,
            new(Candidates: new(ToAdd: [candidateId])));
        var updated = await solutionsRepository.GetFull(id);
        return Results.Ok(updated!);
    }

    public async Task<Result<SolutionFullInfo>> JoinRequest(Guid candidateId, Guid id)
    {
        var solution = await solutionsRepository.GetFull(id);
        if (solution == null)
            return Results.NotFound<SolutionFullInfo>();
        if (solution.CandidatesJoinRequested?.Any(e => e.Id == candidateId) is true)
            return Results.Ok(solution);
        if (solution.Candidates.Count >= solution.Assignment.CandidatesCapacity)
            return Results.BadRequest<SolutionFullInfo>($"Solution team is full");

        await solutionsRepository.Patch(id, new(
            CandidatesJoinRequested: new(ToAdd: [candidateId])));
        var updated = await solutionsRepository.GetFull(id);
        return Results.Ok(updated!);
    }

    public async Task<Result<SolutionFullInfo>> JoinRequestAccept(Guid candidateOwnerId, Guid candidateJoinRequestedId, Guid id)
    {
        var solution = await solutionsRepository.GetFull(id);
        if (solution == null)
            return Results.NotFound<SolutionFullInfo>();
        if (solution.CandidateOwner.Id != candidateOwnerId)
            return Results.Forbidden<SolutionFullInfo>("Only team leader can accept");
        if (solution.Candidates.Any(e => e.Id == candidateJoinRequestedId))
            return Results.Ok(solution);
        if (solution.CandidatesJoinRequested?.Any(e => e.Id == candidateJoinRequestedId) != true)
            return Results.BadRequest<SolutionFullInfo>($"There is no requested to join candidate with id: {candidateJoinRequestedId}");
        
        await solutionsRepository
            .Patch(id, new(
                Candidates: new(ToAdd: [candidateJoinRequestedId]),
                CandidatesJoinRequested: new (ToRemove: [candidateJoinRequestedId])));
        
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

        await solutionsRepository
            .Patch(id, new(
                State: SolutionState.InProgress,
                StartedAt: DateOnly.FromDateTime(DateTime.UtcNow)));
        var updated = await solutionsRepository.GetFull(id);
        return Results.Ok(updated!);
    }

    public async Task<Result<SolutionFullInfo>> SendToReview(Guid candidateOwnerId, Guid id)
    {
        var solution = await solutionsRepository.Get(id);
        if (solution == null)
            return Results.NotFound<SolutionFullInfo>();
        if (solution.CandidateOwnerId != candidateOwnerId)
            return Results.Forbidden<SolutionFullInfo>();
        if (solution.State != SolutionState.InProgress)
            return Results.BadRequest<SolutionFullInfo>($"State of Solution is incorrect: {solution.State}");

        await solutionsRepository
            .Patch(id, new(State: SolutionState.ExpertReview));
        var updated = await solutionsRepository.GetFull(id);
        return Results.Ok(updated!);
    }

    public async Task<Result<SolutionFullInfo>> SubmitReview(Guid expertId, Guid id, SolutionSubmitReviewRequest request)
    {
        var solution = await solutionsRepository.GetFull(id);
        if (solution == null)
            return Results.NotFound<SolutionFullInfo>("Solution not found");
        
        var expert = await expertsRepository.GetFull(expertId);
        if (expert == null)
            return Results.BadRequest<SolutionFullInfo>("Expert not found");

        if (expert.Employer.Id != solution.Assignment.Employer.Id)
            return Results.NotFound<SolutionFullInfo>($"Expert does not has access to EmployerId: {solution.Assignment.Employer.Id}");

        var curAttemptNumber = (solution.ExpertReviews?.Count ?? 0) + 1;
        var expertReviewCreatedAt = DateTime.UtcNow;
        await expertReviewsRepository.Create(new(
            expert.Id,
            solution.Id,
            request.Comment, 
            request.Score,
            curAttemptNumber,
            expertReviewCreatedAt, 
            expertReviewCreatedAt
        ));
        var maxAttemptCount = solution.Assignment.AttemptsCapacity;
        var newState = request.ResultState switch
        {
            SolutionSubmitReviewResultState.Done => SolutionState.Done,
            SolutionSubmitReviewResultState.Failed when curAttemptNumber != maxAttemptCount => SolutionState.RequiresImprovements,
            SolutionSubmitReviewResultState.Failed when curAttemptNumber == maxAttemptCount => SolutionState.Failed,
            _ => throw new ArgumentOutOfRangeException()
        };
        // TODO: Начислить рейтинг кандидатам
        // TODO: Добавить возможность медалировать
        await solutionsRepository.Patch(id, new(
            State: newState));
        var updated = await solutionsRepository.GetFull(id);
        return Results.Ok(updated!);
    }
}
