using Domain.Authorization;
using Microsoft.AspNetCore.Authorization;

namespace API.Configuration.Auth;

public class AuthorizeRolesAttribute : AuthorizeAttribute
{
    public AuthorizeRolesAttribute(params AccountRole[] roles) : base()
    {
        Roles = string.Join(",", roles.Select(e => e.ToString()));
    }
}