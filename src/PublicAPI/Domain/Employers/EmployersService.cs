using Domain.Authorization;
using Domain.Authorization.DTO;
using Domain.Employers.DTO;
using Infrastructure.Results;

namespace Domain.Employers;

public interface IEmployersService
{
    Task<Result<Employer>> Get(Guid id);
    Task<Result<Employer>> Get(string login);
    Task<Result<Employer>> Add(EmployerCreateRequest createRequest);
    Task<Result<Employer>> Patch(Guid id, EmployerUpdateEntity patchRequest);
    Task<EmptyResult> ChangePassword(Guid id, ChangePasswordRequest request);
}

public class EmployersService(
    IEmployersRepository employersRepository,
    IAccountsRepository accountsRepository,
    IPasswordHasher passwordHasher
) : IEmployersService
{
    public async Task<Result<Employer>> Get(Guid id)
    {
        var res = await employersRepository.Get(id);
        if (res == null)
            return Results.NotFound<Employer>("");

        return Results.Ok(res);
    }

    public async Task<Result<Employer>> Get(string login)
    {
        var res = await employersRepository.Get(login);
        if (res == null)
            return Results.NotFound<Employer>("");

        return Results.Ok(res);
    }

    public async Task<Result<Employer>> Add(EmployerCreateRequest createRequest)
    {
        var existed = await accountsRepository.Find(createRequest.Login);
        if (existed != null)
            return Results.BadRequest<Employer>("Login is already in use");
        
        var res = await employersRepository.Add(new(
            createRequest.Login, 
            passwordHasher.HashPassword(createRequest.Password),
            createRequest.Name,
            createRequest.Email,
            createRequest.PhoneNumber,
            createRequest.SiteUrl
        ));
        return Results.Ok(res);
    }

    public async Task<Result<Employer>> Patch(Guid id, EmployerUpdateEntity patchRequest)
    {
        var existed = await employersRepository.Get(id);
        if (existed == null)
            return Results.NotFound<Employer>("");
        
        var updated = await employersRepository.Update(id, patchRequest);
        return Results.Ok(updated);
    }

    public async Task<EmptyResult> ChangePassword(Guid id, ChangePasswordRequest request)
    {
        if (request.OldPassword ==  request.NewPassword)
            return EmptyResults.BadRequest("Passwords should not be the same");
        
        var existed = await accountsRepository.GetEmployer(id);
        if (existed == null)
            return EmptyResults.NotFound("Such Id is not exists");
        if (!passwordHasher.VerifyPassword(request.OldPassword, existed.PasswordHash))
            return EmptyResults.BadRequest("Old password is not correct");

        var updated = await employersRepository.Update(id,
            new()
            {
                PasswordHash = passwordHasher.HashPassword(request.NewPassword)
            });
        return EmptyResults.NoContent();
    }
}