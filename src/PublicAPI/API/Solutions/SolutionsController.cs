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
    /// <remarks>
    /// `Text` - ищет по Team(Name + Description) 
    /// </remarks>
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
            candidateId,
            request.Team == null ? null : new(request.Team.Name, request.Team.Description)));
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
    /// Вступить в команду решения (без подтверждения)
    /// </summary>
    [AuthorizeRoles(AccountRole.Candidate)]
    [HttpPost("{id:Guid}/join")]
    public async Task<ActionResult<SolutionFullInfo>> Join([FromRoute] Guid id)
    {
        var candidateId = User.GetId();
        var solution = await solutionsService.Join(candidateId, id);
        return solution.ActionResult;
    }
    
    /// <summary>
    /// Кинуть заявку на вступление (её подтверждает лидер)
    /// </summary>
    [AuthorizeRoles(AccountRole.Candidate)]
    [HttpPost("{id:Guid}/join/request")]
    public async Task<ActionResult<SolutionFullInfo>> JoinRequest([FromRoute] Guid id)
    {
        var candidateId = User.GetId();
        var solution = await solutionsService.JoinRequest(candidateId, id);
        return solution.ActionResult;
    }
    
    /// <summary>
    /// Подтвердить заявку на вступление (может только лидер)
    /// </summary>
    [AuthorizeRoles(AccountRole.Candidate)]
    [HttpPost("{id:Guid}/join/request/accept")]
    public async Task<ActionResult<SolutionFullInfo>> JoinRequestAccept(
        [FromRoute] Guid id,
        [FromBody] SolutionJoinRequestAcceptApiRequest request)
    {
        var candidateOwnerId = User.GetId();
        var solution = await solutionsService.JoinRequestAccept(candidateOwnerId, request.CandidateJoinRequestedId, id);
        return solution.ActionResult;
    }
    
    /// <summary>
    /// Начать решение (может только лидер)
    /// </summary>
    [AuthorizeRoles(AccountRole.Candidate)]
    [HttpPost("{id:Guid}/start")]
    public async Task<ActionResult<SolutionFullInfo>> Start([FromRoute] Guid id)
    {
        var candidateId = User.GetId();
        var solution = await solutionsService.Start(candidateId, id);
        return solution.ActionResult;
    }
    
    /// <summary>
    /// Отправить на проверку. Сейчас сразу Эксперту
    /// </summary>
    [AuthorizeRoles(AccountRole.Candidate)]
    [HttpPost("{id:Guid}/send-to-review")]
    public async Task<ActionResult<SolutionFullInfo>> SendToReview([FromRoute] Guid id)
    {
        var candidateId = User.GetId();
        var solution = await solutionsService.SendToReview(candidateId, id);
        return solution.ActionResult;
    }
    
    /// <summary>
    /// Дать отзыв на решение. Может только Эксперт
    /// </summary>
    /// <remarks>
    /// Проверяет что Эксперт от той же компании, что и Assignment
    /// </remarks>
    [AuthorizeRoles(AccountRole.Expert)]
    [HttpPost("{id:Guid}/submit-review")]
    public async Task<ActionResult<SolutionFullInfo>> SubmitReview(
        [FromRoute] Guid id,
        [FromBody] SolutionSubmitReviewRequest request)
    {
        var expertId = User.GetId();
        var solution = await solutionsService.SubmitReview(expertId, id, request);
        return solution.ActionResult;
    }
}