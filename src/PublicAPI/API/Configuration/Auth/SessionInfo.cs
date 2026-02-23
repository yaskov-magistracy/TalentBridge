using Domain.Authorization;

namespace API.Configuration.Auth;

public class SessionInfo(Guid userId, AccountRole role)
{
    public Guid UserId { get; set; } = userId;
    public AccountRole Role { get; set; } = role;
}