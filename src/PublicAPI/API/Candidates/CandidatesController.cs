using API.Candidates.DTO;
using API.Configuration.Auth;
using Domain.Authorization;
using Domain.Authorization.DTO;
using Domain.Candidates;
using Domain.Candidates.DTO;
using Microsoft.AspNetCore.Mvc;

namespace API.Candidates;

[ApiController]
[Route("api/[controller]")]
public class CandidatesController(
    ICandidatesService candidatesService
) : ControllerBase
{
    /// <summary>
    /// Получить полную инфу о Соискателе. 
    /// </summary>
    [HttpGet("{id:Guid}")]
    public async Task<ActionResult<Guid>> PatchCandidate([FromRoute] Guid id)
    {
        var res = await candidatesService.GetFull(id);
        return res.ActionResult;
    }
    
    /// <summary>
    /// Регистрация Соискателя
    /// </summary>
    [HttpPost("")]
    public async Task<ActionResult<Guid>> CreateCandidate([FromBody] CandidateCreateRequest request)
    {
        var res = await candidatesService.Add(request);
        return res.ActionResult;
    }
    
    /// <summary>
    /// Редактирование Соискателя.
    /// </summary>
    [AuthorizeRoles(AccountRole.Candidate)]
    [HttpPatch("{id:Guid}")]
    public async Task<ActionResult<Guid>> PatchCandidate([FromRoute] Guid id, [FromBody] CandidatePatchApiRequest request)
    {
        var userId = User.GetId();
        if (userId != id)
            return Forbid();
        
        var res = await candidatesService.Patch(
            id, new(
                null,
                request.Surname,
                request.Name,
                request.Patronymic,
                request.City,
                request.About,
                request.Technologies));
        return res.ActionResult;
    }
    
    /// <summary>
    /// Смена пароля.
    /// </summary>
    [AuthorizeRoles(AccountRole.Candidate)]
    [HttpPost("{id:Guid}/change-password")]
    public async Task<ActionResult<Guid>> ChangePassword([FromRoute] Guid id, [FromBody] ChangePasswordRequest request)
    {
        var userId = User.GetId();
        if (userId != id)
            return Forbid();
        
        var res = await candidatesService.ChangePassword(id, request);
        return res.ActionResult;
    }
}