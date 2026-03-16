using API.Configuration.Auth;
using Domain.Authorization;
using Domain.Authorization.DTO;
using Domain.Employers;
using Domain.Employers.DTO;
using Microsoft.AspNetCore.Mvc;

namespace API.Employers;

[ApiController]
[Route("api/[controller]")]
public class EmployersController(
    IEmployersService employersService
) : ControllerBase
{
    /// <summary>
    /// Регистрация Работодателя
    /// </summary>
    [HttpPost("")]
    public async Task<ActionResult<Guid>> RegisterEmployer([FromBody] RegisterEmployerRequest request)
    {
        var res = await employersService.Add(request);
        return res.ActionResult;
    }
    
    /// <summary>
    /// Смена пароля.
    /// </summary>
    [AuthorizeRoles(AccountRole.Employer)]
    [HttpPost("{id:Guid}/change-password")]
    public async Task<ActionResult<Guid>> ChangePassword([FromRoute] Guid id, [FromBody] ChangePasswordRequest request)
    {
        var userId = User.GetId();
        if (userId != id)
            return Forbid();
        
        var res = await employersService.ChangePassword(id, request);
        return res.ActionResult;
    }
}