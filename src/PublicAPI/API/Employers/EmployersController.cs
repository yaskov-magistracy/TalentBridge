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
    public async Task<ActionResult<Guid>> Add([FromBody] EmployerCreateRequest createRequest)
    {
        var res = await employersService.Add(createRequest);
        return res.ActionResult;
    }
    
    /// <summary>
    /// Редактирование Работодателя
    /// </summary>
    [AuthorizeRoles(AccountRole.Employer)]
    [HttpPost("{id:Guid}")]
    public async Task<ActionResult<Guid>> Patch([FromRoute] Guid id, [FromBody] EmployerUpdateEntity patchRequest)
    {
        var userId = User.GetId();
        if (userId != id)
            return Forbid();
        
        var res = await employersService.Patch(id, patchRequest);
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