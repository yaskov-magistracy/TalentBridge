using System.Security.Claims;
using API.Configuration.Auth;
using Domain.Authorization;
using Domain.Authorization.DTO;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using IAuthorizationService = Domain.Authorization.IAuthorizationService;

namespace API.Authorization;

[ApiController]
[Route("api/auth")]
public class AuthorizationController(
    IAuthorizationService authorizationService
) : ControllerBase
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