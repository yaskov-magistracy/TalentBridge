using API.Configuration.Auth;
using Domain.Authorization;
using Domain.Authorization.DTO;
using Domain.Experts;
using Domain.Experts.DTO;
using Microsoft.AspNetCore.Mvc;

namespace API.Experts;

[ApiController]
[Route("api/[controller]")]
public class ExpertsController(
    IExpertsService expertsService
) : ControllerBase
{
    /// <summary>
    /// Регистрация Эксперта
    /// </summary>
    [HttpPost("")]
    public async Task<ActionResult<Guid>> Add([FromBody] ExpertCreateRequest createRequest)
    {
        var res = await expertsService.Add(createRequest);
        return res.ActionResult;
    }
    
    /// <summary>
    /// Редактирование Эксперта
    /// </summary>
    [AuthorizeRoles(AccountRole.Expert)]
    [HttpPost("{id:Guid}")]
    public async Task<ActionResult<Guid>> Patch([FromRoute] Guid id, [FromBody] ExpertUpdateEntity patchRequest)
    {
        var userId = User.GetId();
        if (userId != id)
            return Forbid();
        
        var res = await expertsService.Patch(id, patchRequest);
        return res.ActionResult;
    }
    
    /// <summary>
    /// Смена пароля.
    /// </summary>
    [AuthorizeRoles(AccountRole.Expert)]
    [HttpPost("{id:Guid}/change-password")]
    public async Task<ActionResult<Guid>> ChangePassword([FromRoute] Guid id, [FromBody] ChangePasswordRequest request)
    {
        var userId = User.GetId();
        if (userId != id)
            return Forbid();
        
        var res = await expertsService.ChangePassword(id, request);
        return res.ActionResult;
    }
}