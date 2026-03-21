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
        var assignment = await technologiesService.Get(id);
        return assignment.ActionResult;
    }
    
    /// <summary>
    /// Поиск по технологиям
    /// </summary>
    [HttpPost("search")]
    public async Task<ActionResult<TechnologySearchResponse>> Search([FromBody] TechnologySearchRequest searchRequest)
    {
        var assignment = await technologiesService.Search(searchRequest);
        return assignment.ActionResult;
    }
    
    /// <summary>
    /// Добавить технологию
    /// </summary>
    [HttpPost("")]
    public async Task<ActionResult<Technology>> Add([FromBody] TechnologyCreateEntity request)
    {
        var assignment = await technologiesService.Add(request);
        return assignment.ActionResult;
    }
    
    /// <summary>
    /// Обновить технологию
    /// </summary>
    [HttpPatch("{id:Guid}")]
    public async Task<ActionResult<Technology>> Update([FromRoute] Guid id, [FromBody] TechnologyUpdateEntity request)
    {
        var assignment = await technologiesService.Update(id, request);
        return assignment.ActionResult;
    }
}