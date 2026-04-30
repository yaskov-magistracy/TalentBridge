using Domain.Authorization;
using Domain.Authorization.DTO;
using Domain.Candidates.DTO;
using Domain.Solutions;
using Infrastructure.Results;

namespace Domain.Candidates;

public interface ICandidatesService
{
    Task<Result<Candidate>> Get(Guid id);
    Task<Result<CandidateFullInfo>> GetFull(Guid id);
    Task<Result<Candidate>> Get(string login);
    Task<Result<CandidateFullInfo>> GetFull(string login);
    Task<Result<CandidateFullInfo>> Add(CandidateCreateRequest request);
    Task<Result<CandidateFullInfo>> Patch(Guid id, CandidatePatchEntity patchEntity);
    Task<EmptyResult> ChangePassword(Guid id, ChangePasswordRequest request);
    Task<Result<float>> UpdateRating(Guid id);
}

public class CandidatesService(
    ICandidatesRepository candidatesRepository,
    IAccountsRepository accountsRepository,
    IPasswordHasher passwordHasher,
    ISolutionsRepository solutionsRepository
    ) : ICandidatesService
{
    public async Task<Result<Candidate>> Get(Guid id)
    {
        var res = await candidatesRepository.Get(id);
        if (res == null)
            return Results.NotFound<Candidate>("");

        return Results.Ok(res);
    }

    public async Task<Result<CandidateFullInfo>> GetFull(Guid id)
    {
        var res = await candidatesRepository.GetFull(id);
        if (res == null)
            return Results.NotFound<CandidateFullInfo>("");

        return Results.Ok(res);
    }

    public async Task<Result<Candidate>> Get(string login)
    {
        var res = await candidatesRepository.Get(login);
        if (res == null)
            return Results.NotFound<Candidate>("");

        return Results.Ok(res);
    }

    public async Task<Result<CandidateFullInfo>> GetFull(string login)
    {
        var res = await candidatesRepository.GetFull(login);
        if (res == null)
            return Results.NotFound<CandidateFullInfo>("");

        return Results.Ok(res);
    }

    public async Task<Result<CandidateFullInfo>> Add(CandidateCreateRequest request)
    {
        var existed = await accountsRepository.Find(request.Login);
        if (existed != null)
            return Results.BadRequest<CandidateFullInfo>("Login is already in use");
        
        var res = await candidatesRepository.Create(new(
            request.Login, 
            passwordHasher.HashPassword(request.Password),
            request.Surname,
            request.Name,
            request.Patronymic,
            request.City,
            request.About,
            request.Technologies
        ));
        return Results.Ok(res);
    }

    public async Task<Result<CandidateFullInfo>> Patch(Guid id, CandidatePatchEntity request)
    {
        var existed = await candidatesRepository.Get(id);
        if (existed == null)
            return Results.NotFound<CandidateFullInfo>("");
        
        var updated = await candidatesRepository.Patch(id, request);
        return Results.Ok(updated);
    }

    public async Task<EmptyResult> ChangePassword(Guid id, ChangePasswordRequest request)
    {
        if (request.OldPassword == request.NewPassword)
            return EmptyResults.BadRequest("Passwords should not be the same");
        
        var existed = await accountsRepository.GetCandidate(id);
        if (existed == null)
            return EmptyResults.NotFound("Such Id is not exists");
        if (!passwordHasher.VerifyPassword(request.OldPassword, existed.PasswordHash))
            return EmptyResults.BadRequest("Old password is not correct");

        var updated = await candidatesRepository.Patch(
            id,
            new(PasswordHash: passwordHasher.HashPassword(request.NewPassword)));
        return EmptyResults.NoContent();
    }

    public async Task<Result<float>> UpdateRating(Guid id)
    {
        var searchResponse = await solutionsRepository.Search(new()
        {
            CandidateId = id,
            State = SolutionState.Done,
        });

        var totalScores = 0f;
        var totalDiffCoefficients = 0f;
        foreach (var solution in searchResponse.Items)
        {
            var lastReview = solution.GetLastReview();
            var diffCoeff = solution.Assignment.GetDifficultyCoefficient();
            var attemptCoeff = solution.Assignment.AttemptsCoefficients[lastReview.AttemptNumber - 1];
            totalScores += lastReview.Score * diffCoeff * attemptCoeff;
            totalDiffCoefficients += diffCoeff;
        }
        totalDiffCoefficients = MathF.Max(1, totalDiffCoefficients); // to ignore nan
        var newRating = MathF.Min(100f, totalScores / totalDiffCoefficients * 10);
        await candidatesRepository.Patch(id, new()
        {
            Rating = newRating,
        });
        return Results.Ok(newRating);
    }
}