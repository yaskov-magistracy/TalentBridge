using Domain.Authorization;
using Domain.Authorization.DTO;
using Domain.Candidates.DTO;
using Infrastructure.Results;

namespace Domain.Candidates;

public interface ICandidatesService
{
    Task<Result<Candidate>> Get(Guid id);
    Task<Result<Candidate>> Get(string login);
    Task<Result<Candidate>> Register(RegisterCandidateRequest request);
    Task<EmptyResult> ChangePassword(Guid id, ChangePasswordRequest request);
}

public class CandidatesService(
    ICandidatesRepository candidatesRepository,
    IAccountsRepository accountsRepository,
    IPasswordHasher passwordHasher
    ) : ICandidatesService
{
    public async Task<Result<Candidate>> Get(Guid id)
    {
        var res = await candidatesRepository.Get(id);
        if (res == null)
            return Results.NotFound<Candidate>("");

        return Results.Ok(res);
    }

    public async Task<Result<Candidate>> Get(string login)
    {
        var res = await candidatesRepository.Get(login);
        if (res == null)
            return Results.NotFound<Candidate>("");

        return Results.Ok(res);
    }

    public async Task<Result<Candidate>> Register(RegisterCandidateRequest request)
    {
        var existed = await accountsRepository.Find(request.Login);
        if (existed != null)
            return Results.BadRequest<Candidate>("Login is already in use");
        
        var res = await candidatesRepository.Add(new(
            request.Login, 
            passwordHasher.HashPassword(request.Password)
        ));
        return Results.Ok(res);
    }

    public async Task<EmptyResult> ChangePassword(Guid id, ChangePasswordRequest request)
    {
        if (request.OldPassword ==  request.NewPassword)
            return EmptyResults.BadRequest("Passwords should not be the same");
        
        var existed = await accountsRepository.GetCandidate(id);
        if (existed == null)
            return EmptyResults.NotFound("Such Id is not exists");
        if (!passwordHasher.VerifyPassword(request.OldPassword, existed.PasswordHash))
            return EmptyResults.BadRequest("Old password is not correct");

        var updated = await candidatesRepository.Update(id,
            new()
            {
                PasswordHash = passwordHasher.HashPassword(request.NewPassword)
            });
        return EmptyResults.NoContent();
    }
}