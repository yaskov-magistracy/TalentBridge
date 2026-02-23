using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Authorization;

[ApiController]
[Route("api/auth")]
public class AuthorizationController : ControllerBase
{
    /// <summary>
    /// Текущая сессия пользователя
    /// </summary>
    [Authorize]
    [HttpGet("session")]
    public async Task GetSession()
    {
    }
    
    /// <summary>
    /// Вход
    /// </summary>
    [HttpGet("login")]
    public async Task Login()
    {
    }
    
    /// <summary>
    /// Регистрация
    /// </summary>
    [HttpGet("register")]
    public async Task Register()
    {
    }
    
    /// <summary>
    /// Выход
    /// </summary>
    [Authorize]
    [HttpGet("logout")]
    public async Task Logout()
    {
    }
}