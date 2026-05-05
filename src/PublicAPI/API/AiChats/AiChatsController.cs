using API.Configuration.Auth;
using Domain.AiChats;
using Domain.AiChats.DTO;
using GigaChat;
using GigaChat.Files.Response;
using Infrastructure.Results;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.AiChats;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class AiChatsController(
    IAiChatsService aiChatsService,
    IGigaChatClient gigaChatClient
) : ControllerBase
{
    /// <summary>
    /// Даёт текущий `Активный` чат
    /// </summary>
    [HttpGet("my")]
    public async Task<ActionResult<AiChat>> GetForUser()
    {
        var userId = User.GetId();
        var res = await aiChatsService.GetByUserId(userId);
        return res.ActionResult;
    }

    /// <summary>
    /// Создать новый чат
    /// </summary>
    /// <remarks>
    /// Последний активный чат уйдёт в Архив (станет неактивным)
    /// </remarks>
    [HttpPost("")]
    public async Task<ActionResult<AiChat>> Create()
    {
        var userId = User.GetId();
        var res = await aiChatsService.Create(new(userId));
        return res.ActionResult;
    }

    /// <summary>
    /// Написать сообщение в чат
    /// </summary>
    [HttpPost("{chatId:Guid}/messages")]
    public async Task<ActionResult<AiChatSendMessageResponse>> SendMessage(
        [FromRoute] Guid chatId, 
        [FromBody] AiChatSendMessageRequest request)
    {
        var res = await aiChatsService.SendMessage(chatId, request);
        return res.ActionResult;
    }
    
    /// <summary>
    /// Список доступных файлов в хранилище GigaChat
    /// </summary>
    [HttpGet("files")]
    public async Task<ActionResult<GigaChatGetFilesResponse>> GetFiles()
    {
        var result = await gigaChatClient.GetFiles();
        return Ok(result);
    }
}