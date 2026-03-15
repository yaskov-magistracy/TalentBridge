using Domain.Technologies;
using Domain.Technologies.DTO;
using Microsoft.AspNetCore.Mvc;

namespace API.Technologies;

[ApiController]
[Route("api/[controller]")]
public class TechnologiesController(
    ITechnologiesService technologiesService    
) : ControllerBase
{
    /// <summary>
    /// Получить технологию
    /// </summary>
    [HttpGet("{id:Guid}")]
    public async Task<ActionResult<Technology>> Get([FromRoute] Guid id)
    {
        var employerTask = await technologiesService.Get(id);
        return employerTask.ActionResult;
    }
    
    /// <summary>
    /// Поиск по технологиям
    /// </summary>
    [HttpPost("search")]
    public async Task<ActionResult<Technology>> Search([FromBody] TechnologySearchRequest searchRequest)
    {
        var employerTask = await technologiesService.Search(searchRequest);
        return employerTask.ActionResult;
    }
    
    /// <summary>
    /// Добавить технологию
    /// </summary>
    [HttpPost("")]
    public async Task<ActionResult<Technology>> Add([FromBody] TechnologyCreateEntity request)
    {
        var employerTask = await technologiesService.Add(request);
        return employerTask.ActionResult;
    }
    
    /// <summary>
    /// Обновить технологию
    /// </summary>
    [HttpPatch("{id:Guid}")]
    public async Task<ActionResult<Technology>> Update([FromRoute] Guid id, [FromBody] TechnologyUpdateEntity request)
    {
        var employerTask = await technologiesService.Update(id, request);
        return employerTask.ActionResult;
    }
}