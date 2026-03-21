using API.Configuration.Auth;
using API.Solutions.DTO;
using Domain.Authorization;
using Domain.Solutions;
using Domain.Solutions.DTO;
using Microsoft.AspNetCore.Mvc;

namespace API.Solutions;

[Route("api/[controller]")]
[ApiController]
public class SolutionsController(
    ISolutionsService solutionsService    
) : ControllerBase
{
    /// <summary>
    /// Получить решение
    /// </summary>
    [HttpGet("{id:Guid}")]
    public async Task<ActionResult<SolutionFullInfo>> Get([FromRoute] Guid id)
    {
        var solution = await solutionsService.Get(id);
        return solution.ActionResult;
    }
    
    /// <summary>
    /// Поиск по решениям
    /// </summary>
    [HttpPost("search")]
    public async Task<ActionResult<SolutionSearchResponse>> Search([FromBody] SolutionSearchRequest searchRequest)
    {
        var solution = await solutionsService.Search(searchRequest);
        return solution.ActionResult;
    }
    
    /// <summary>
    /// Добавить решение
    /// </summary>
    [AuthorizeRoles(AccountRole.Candidate)]
    [HttpPost("")]
    public async Task<ActionResult<SolutionFullInfo>> Add([FromBody] SolutionCreateApiRequest request)
    {
        var candidateId = User.GetId();
        var solution = await solutionsService.Add(new(
            request.AssignmentId,
            candidateId));
        return solution.ActionResult;
    }
    
    /// <summary>
    /// Обновить решение
    /// </summary>
    [AuthorizeRoles(AccountRole.Candidate)]
    [HttpPatch("{id:Guid}")]
    public async Task<ActionResult<SolutionFullInfo>> Update([FromRoute] Guid id, [FromBody] SolutionPatchRequest request)
    {
        var candidateId = User.GetId();
        var solution = await solutionsService.Update(candidateId, id, request);
        return solution.ActionResult;
    }
    
    /// <summary>
    /// Отправить на проверку
    /// </summary>
    [AuthorizeRoles(AccountRole.Candidate)]
    [HttpPatch("{id:Guid}/send-to-review")]
    public async Task<ActionResult<SolutionFullInfo>> SendToReview([FromRoute] Guid id)
    {
        var candidateId = User.GetId();
        var solution = await solutionsService.SendToReview(candidateId, id);
        return solution.ActionResult;
    }
}