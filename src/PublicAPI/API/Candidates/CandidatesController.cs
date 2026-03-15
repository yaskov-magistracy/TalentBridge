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
    /// Регистрация Соискателя
    /// </summary>
    [HttpPost("register/candidate")]
    public async Task<ActionResult<Guid>> RegisterCandidate([FromBody] RegisterCandidateRequest request)
    {
        var res = await candidatesService.Add(request);
        return res.ActionResult;
    }
}