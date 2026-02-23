using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Infrastructure.Configuration.Routes;

public class DateOnlyRouteConstraint : IRouteConstraint
{
    public bool Match(
        HttpContext httpContext, 
        IRouter route, 
        string routeKey, 
        RouteValueDictionary values, 
        RouteDirection routeDirection)
    {
        if (!values.TryGetValue(routeKey, out var value) 
            || value == null)
            return false;

        return true;
    }
}