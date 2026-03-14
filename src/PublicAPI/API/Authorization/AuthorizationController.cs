using System.Security.Claims;
using API.Configuration.Auth;
using Domain.Authorization;
using Domain.Authorization.DTO;
using Domain.Candidates;
using Domain.Candidates.DTO;
using Domain.Employers;
using Domain.Employers.DTO;
using Infrastructure.Results;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EmptyResult = Infrastructure.Results.EmptyResult;
using IAuthorizationService = Domain.Authorization.IAuthorizationService;

namespace API.Authorization;

/// <summary>
/// asdasdsda
/// </summary>
/// <param name="authorizationService"></param>
/// <param name="candidatesService"></param>
/// <param name="employersService"></param>
[ApiController]
[Route("api/auth")]
public class AuthorizationController(
    IAuthorizationService authorizationService,
    ICandidatesService candidatesService,
    IEmployersService employersService) : ControllerBase
{
    /// <summary>
    /// Текущая сессия пользователя
    /// </summary>
    [Authorize]
    [HttpGet("session")]
    public async Task<ActionResult<SessionInfo>> GetSession() 
        => Ok(new SessionInfo(User.GetId(), User.GetRole()));

    /// <summary>
    /// Вход
    /// </summary>
    /// <remarks>
    /// Регистрация аккаунтов в контроллерах сущностей (Employers/Candidates)
    /// </remarks>
    [HttpPost("login")]
    public async Task<ActionResult<SessionInfo>> Login(LoginRequest request)
    {
        var result = await authorizationService.Login(request);
        if (!result.IsSuccess)
            return result.ActionResult;

        var loginResult = result.Value;
        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, BuildClaims(loginResult));
        return Ok(new SessionInfo(
            loginResult.Id,
            loginResult.Role)
        );
    }
    
    /// <summary>
    /// Выход
    /// </summary>
    [Authorize]
    [HttpPost("logout")]
    public async Task<NoContentResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return NoContent();
    }

    /// <summary>
    /// Смена пароля
    /// </summary>
    [Authorize]
    [HttpPost("change-password")]
    public async Task<ActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        var id = User.GetId();
        var role = User.GetRole();
        EmptyResult result = EmptyResults.NotImplemented();
        if (role == AccountRole.Candidate)
            result = await candidatesService.ChangePassword(id, request);
        else if (role == AccountRole.Employer)
            result = await employersService.ChangePassword(id, request);

        return result.ActionResult;
    }
    
    private ClaimsPrincipal BuildClaims(Account account)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, account.Id.ToString()),
            new Claim(ClaimTypes.Role, account.Role.ToString())
        };
        var credentials = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        return new ClaimsPrincipal(credentials);
    }
}