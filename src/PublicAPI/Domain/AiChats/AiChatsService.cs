using Domain.AiChats.DTO;
using GigaChad;
using GigaChad.Completions.Request;
using Infrastructure.Results;

namespace Domain.AiChats;

public interface IAiChatsService
{
    Task<Result<AiChat>> GetByUserId(Guid userId);
    Task<Result<AiChat>> Create(AiChatCreateEntity createEntity);
    Task<Result<AiChatSendMessageResponse>> SendMessage(Guid chatId, AiChatSendMessageRequest request);
    Task<EmptyResult> Patch(Guid chatId, AiChatPatchEntity patchEntity);
}

public class AiChatsService(
    IAiChatsRepository aiChatsRepository,
    IGigaChadMessageSender gigaChadMessageSender
) : IAiChatsService
{
    public async Task<Result<AiChat>> GetByUserId(Guid userId)
    {
        var chat = await aiChatsRepository.GetByUserId(userId);
        return chat == null
            ? Results.NotFound<AiChat>()
            : Results.Ok(chat);
    }

    public async Task<Result<AiChat>> Create(AiChatCreateEntity createEntity)
    {
        var exists = await aiChatsRepository.GetByUserId(createEntity.UserId);
        if (exists != null)
        {
            await Patch(exists.Id, new(IsArchived: true));
        }
        
        var createdId = await aiChatsRepository.Create(createEntity);
        return Results.Ok((await aiChatsRepository.Get(createdId))!);
    }

    public async Task<Result<AiChatSendMessageResponse>> SendMessage(Guid chatId, AiChatSendMessageRequest request)
    {
        var chat = await aiChatsRepository.Get(chatId);
        if (chat == null)
            return Results.NotFound<AiChatSendMessageResponse>();

        var userMessageTime = DateTime.UtcNow;
        var gigaChadResponse = await gigaChadMessageSender.GetChatResponse(chat, request.Text);
        var response = await aiChatsRepository.SendMessage(chatId, [
            new AiChatMessageCreateEntity(chat.Id, request.Text, AiChatMessageAuthor.User, userMessageTime),
            new AiChatMessageCreateEntity(chat.Id, gigaChadResponse, AiChatMessageAuthor.Ai, DateTime.UtcNow)
        ]);
        var userMessage = (await aiChatsRepository.GetMessage(response.userReqId))!;
        var aiMessage = (await aiChatsRepository.GetMessage(response.aiResId))!;
        return Results.Ok(new AiChatSendMessageResponse(userMessage, aiMessage));
    }

    public async Task<EmptyResult> Patch(Guid chatId, AiChatPatchEntity patchEntity)
    {
        await aiChatsRepository.Patch(chatId, patchEntity);
        return EmptyResults.NoContent();
    }
}