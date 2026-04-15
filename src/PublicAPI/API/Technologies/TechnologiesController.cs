using API.Technologies.DTO;
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
        var result = await technologiesService.Get(id);
        return result.ActionResult;
    }
    
    /// <summary>
    /// Поиск по технологиям
    /// </summary>
    [HttpPost("search")]
    public async Task<ActionResult<TechnologySearchResponse>> Search([FromBody] TechnologySearchRequest searchRequest)
    {
        var result = await technologiesService.Search(searchRequest);
        return result.ActionResult;
    }
    
    /// <summary>
    /// Добавить технологию
    /// </summary>
    [HttpPost("")]
    public async Task<ActionResult<Technology>> Add([FromBody] TechnologyCreateEntity request)
    {
        var result = await technologiesService.Add(request);
        return result.ActionResult;
    }
    
    /// <summary>
    /// Добавить пачку технологий
    /// </summary>
    [HttpPost("batch")]
    public async Task<ActionResult<Technology>> AddBatch([FromBody] TechnologyAddBatchApiRequest request)
    {
        var result = await technologiesService.AddBatch(request.ToAdd);
        return result.ActionResult;
    }
    
    /// <summary>
    /// Обновить технологию
    /// </summary>
    [HttpPatch("{id:Guid}")]
    public async Task<ActionResult<Technology>> Update([FromRoute] Guid id, [FromBody] TechnologyUpdateEntity request)
    {
        var result = await technologiesService.Update(id, request);
        return result.ActionResult;
    }
}