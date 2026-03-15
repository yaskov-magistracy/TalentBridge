using Domain.Employers;
using Domain.Employers.DTO;
using Microsoft.AspNetCore.Mvc;

namespace API.Employers;

[ApiController]
[Route("api/[controller]")]
public class EmployersController(
    IEmployersService employersService
) : ControllerBase
{
    /// <summary>
    /// Регистрация Работодателя
    /// </summary>
    [HttpPost("register/employer")]
    public async Task<ActionResult<Guid>> RegisterEmployer([FromBody] RegisterEmployerRequest request)
    {
        var res = await employersService.Add(request);
        return res.ActionResult;
    }
}