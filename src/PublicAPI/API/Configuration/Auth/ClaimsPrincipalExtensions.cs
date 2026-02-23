using System.Security.Claims;
using Domain.Authorization;

namespace API.Configuration.Auth;

public static class ClaimsPrincipalExtensions
{
    public static SessionInfo GetAccountInfo(this ClaimsPrincipal user)
        => new(
            user.GetId(),
            user.GetRole());
    
    public static Guid GetId(this ClaimsPrincipal user)
    {
        var id = user.Claims
            .First(claim => claim.Type.EndsWith(ClaimTypes.NameIdentifier))
            .Value;

        return Guid.Parse(id);
    }

    public static AccountRole GetRole(this ClaimsPrincipal user)
    {
        var role = user.Claims
            .First(claim => claim.Type.EndsWith(ClaimTypes.Role))
            .Value;

        return RolesByStrValue[role]; // to dont use reflective parsing
    }

    private static readonly Dictionary<string, AccountRole> RolesByStrValue = Enum
        .GetValues<AccountRole>()
        .ToDictionary(e => e.ToString(), e => e);
}