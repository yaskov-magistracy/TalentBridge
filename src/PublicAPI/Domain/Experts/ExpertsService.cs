using Domain.Authorization;
using Domain.Authorization.DTO;
using Domain.Employers;
using Domain.Experts.DTO;
using Infrastructure.Results;

namespace Domain.Experts;

public interface IExpertsService
{
    Task<Result<Expert>> Get(Guid id);
    Task<Result<Expert>> Get(string login);
    Task<Result<Expert>> Add(ExpertCreateRequest createRequest);
    Task<Result<Expert>> Patch(Guid id, ExpertUpdateEntity patchRequest);
    Task<EmptyResult> ChangePassword(Guid id, ChangePasswordRequest request);
}

public class ExpertsService(
    IExpertsRepository expertsRepository,
    IEmployersRepository employersRepository,
    IAccountsRepository accountsRepository,
    IPasswordHasher passwordHasher
) : IExpertsService
{
    public async Task<Result<Expert>> Get(Guid id)
    {
        var res = await expertsRepository.Get(id);
        if (res == null)
            return Results.NotFound<Expert>("");

        return Results.Ok(res);
    }

    public async Task<Result<Expert>> Get(string login)
    {
        var res = await expertsRepository.Get(login);
        if (res == null)
            return Results.NotFound<Expert>("");

        return Results.Ok(res);
    }

    public async Task<Result<Expert>> Add(ExpertCreateRequest createRequest)
    {
        var existed = await accountsRepository.Find(createRequest.Login);
        if (existed != null)
            return Results.BadRequest<Expert>("Login is already in use");

        var employer = await employersRepository.Get(createRequest.EmployerId);
        if (employer == null)
            return Results.BadRequest<Expert>("EmployerId does not exist");
        
        var res = await expertsRepository.Add(new(
            createRequest.Login,
            passwordHasher.HashPassword(createRequest.Password),
            createRequest.Surname,
            createRequest.Name,
            createRequest.Patronymic,
            createRequest.EmployerId
        ));
        return Results.Ok(res);
    }

    public async Task<Result<Expert>> Patch(Guid id, ExpertUpdateEntity patchRequest)
    {
        var existed = await expertsRepository.Get(id);
        if (existed == null)
            return Results.NotFound<Expert>("");

        await expertsRepository.Update(id, patchRequest);
        var updated = await expertsRepository.Get(id);
        return Results.Ok(updated!);
    }

    public async Task<EmptyResult> ChangePassword(Guid id, ChangePasswordRequest request)
    {
        if (request.OldPassword == request.NewPassword)
            return EmptyResults.BadRequest("Passwords should not be the same");

        var existed = await accountsRepository.GetExpert(id);
        if (existed == null)
            return EmptyResults.NotFound("Such Id is not exists");
        if (!passwordHasher.VerifyPassword(request.OldPassword, existed.PasswordHash))
            return EmptyResults.BadRequest("Old password is not correct");

        var updated = await expertsRepository.Update(id,
            new()
            {
                PasswordHash = passwordHasher.HashPassword(request.NewPassword)
            });
        return EmptyResults.NoContent();
    }
}