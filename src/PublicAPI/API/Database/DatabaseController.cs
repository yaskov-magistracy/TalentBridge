using DAL;
using Microsoft.AspNetCore.Mvc;

namespace API.Database;

[ApiController]
[Route("api/[controller]")]
public class DatabaseController(
    DatabaseAccessor databaseAccessor
) : ControllerBase
{
    /// <summary>
    /// Пересоздаёт БД
    /// </summary>
    [HttpPost("recreate")]
    public async Task<NoContentResult> Recreate()
    {
        await databaseAccessor.RecreateDatabase();
        return NoContent();
    }
}