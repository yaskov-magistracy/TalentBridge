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
    /// <remarks>
    /// Базовые сущности: <br/>
    /// логин/пароль <br/>
    /// Работодатель: employer/employer <br/>
    /// Кандидат: candidate/candidate <br/>
    /// Эксперт: expert/expert <br/>
    /// </remarks>
    [HttpPost("recreate")]
    public async Task<NoContentResult> Recreate()
    {
        await databaseAccessor.RecreateDatabase();
        return NoContent();
    }
}