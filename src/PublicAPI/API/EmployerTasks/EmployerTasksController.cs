using API.Configuration.Auth;
using API.EmployerTasks.DTO;
using Domain.Authorization;
using Domain.EmployerTasks;
using Domain.EmployerTasks.DTO;
using Microsoft.AspNetCore.Mvc;

namespace API.EmployerTasks;

[ApiController]
[Route("api/[controller]")]
public class EmployerTasksController(
    IEmployerTasksService employerTasksService
) : ControllerBase
{
    /// <summary>
    /// Получить задачу
    /// </summary>
    [HttpGet("{id:Guid}")]
    public async Task<ActionResult<EmployerTask>> Get([FromRoute] Guid id)
    {
        var employerTask = await employerTasksService.Get(id);
        return employerTask.ActionResult;
    }
    
    /// <summary>
    /// Поиск по задачам
    /// </summary>
    [HttpPost("search")]
    public async Task<ActionResult<EmployerTask>> Search([FromBody] EmployerTaskSearchRequest searchRequest)
    {
        var employerTask = await employerTasksService.Search(searchRequest);
        return employerTask.ActionResult;
    }
    
    /// <summary>
    /// Добавить задачу
    /// </summary>
    [AuthorizeRoles(AccountRole.Employer)]
    [HttpPost("")]
    public async Task<ActionResult<EmployerTask>> Add([FromBody] EmployerTaskCreateApiRequest request)
    {
        var employerId = User.GetId();
        var employerTask = await employerTasksService.Add(new(
            request.Name,
            request.Description,
            request.TemplateUrl,
            request.DeadLine,
            employerId));
        return employerTask.ActionResult;
    }
    
    /// <summary>
    /// Обновить задачу
    /// </summary>
    [AuthorizeRoles(AccountRole.Employer)]
    [HttpPatch("{id:Guid}")]
    public async Task<ActionResult<EmployerTask>> Update([FromRoute] Guid id, [FromBody] EmployerTaskUpdateEntity request)
    {
        var employerId = User.GetId();
        var employerTask = await employerTasksService.Update(employerId, id, request);
        return employerTask.ActionResult;
    }
}