using API.Assignments.DTO;
using API.Configuration.Auth;
using Domain.Assignments;
using Domain.Assignments.DTO;
using Domain.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Assignments;

[ApiController]
[Route("api/[controller]")]
public class AssignmentsController(
    IAssignmentsService assignmentsService
) : ControllerBase
{
    /// <summary>
    /// Получить задачу
    /// </summary>
    [HttpGet("{id:Guid}")]
    public async Task<ActionResult<AssignmentFullInfo>> Get([FromRoute] Guid id)
    {
        var assignment = await assignmentsService.Get(id);
        return assignment.ActionResult;
    }
    
    /// <summary>
    /// Получить инфу по квоте Медалей у задачи
    /// </summary>
    [HttpGet("{id:Guid}/quota")]
    public async Task<ActionResult<AssignmentQuotaResponse>> GetAssignmentQuota([FromRoute] Guid id)
    {
        var assignment = await assignmentsService.GetQuota(id);
        return assignment.ActionResult;
    }
    
    /// <summary>
    /// Поиск по задачам
    /// </summary>
    [HttpPost("search")]
    public async Task<ActionResult<AssignmentSearchResponse>> Search([FromBody] AssignmentSearchRequest searchRequest)
    {
        var assignment = await assignmentsService.Search(searchRequest);
        return assignment.ActionResult;
    }
    
    /// <summary>
    /// Добавить задачу
    /// </summary>
    [AuthorizeRoles(AccountRole.Employer)]
    [HttpPost("")]
    public async Task<ActionResult<AssignmentFullInfo>> Add([FromBody] AssignmentCreateApiRequest request)
    {
        var employerId = User.GetId();
        var assignment = await assignmentsService.Add(new(
            request.Name,
            request.Description,
            request.TemplateUrl,
            request.DeadLine,
            request.CandidatesCapacity,
            request.Difficulty,
            request.AttemptsCoefficients,
            employerId,
            request.Technologies));
        return assignment.ActionResult;
    }
    
    /// <summary>
    /// Обновить задачу
    /// </summary>
    [AuthorizeRoles(AccountRole.Employer)]
    [HttpPatch("{id:Guid}")]
    public async Task<ActionResult<AssignmentFullInfo>> Update([FromRoute] Guid id, [FromBody] AssignmentPatchEntity request)
    {
        var employerId = User.GetId();
        var assignment = await assignmentsService.Update(employerId, id, request);
        return assignment.ActionResult;
    }
    
    
}