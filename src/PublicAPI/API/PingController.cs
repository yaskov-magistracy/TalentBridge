using Microsoft.AspNetCore.Mvc;

namespace API;

[Route("api/[controller]")]
[ApiController]
public class PingController : ControllerBase
{
    [HttpGet("health")]
    public async Task<ActionResult> Ping()
    {
        return Ok("Всё ок");
    }

    [HttpPost("error")]
    public async Task<ActionResult> PingError()
    {
        throw new Exception("Упала ошибка");
    }
}