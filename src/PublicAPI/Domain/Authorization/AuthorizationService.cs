using Domain.Authorization.DTO;
using Infrastructure.Results;

namespace Domain.Authorization;

public interface IAuthorizationService
{
    Task<Result<Account>> Login(LoginRequest request);
}

public class AuthorizationService(
    IAccountsRepository accountsRepository,
    IPasswordHasher passwordHasher
    ) : IAuthorizationService
{
    public async Task<Result<Account>> Login(LoginRequest request)
    {
        var existed = await accountsRepository.Find(request.Login);
        if (existed == null)
            return Results.NotFound<Account>("Login or password is not correct");
        if (!passwordHasher.VerifyPassword(request.Password, existed.PasswordHash))
            return Results.NotFound<Account>("Login or password is not correct");
        
        return Results.Ok(existed);
    }
}