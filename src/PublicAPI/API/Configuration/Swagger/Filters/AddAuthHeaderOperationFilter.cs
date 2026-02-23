// using Microsoft.AspNetCore.Authentication.Cookies;
// using Microsoft.AspNetCore.Authorization;
// using Microsoft.OpenApi;
// using Swashbuckle.AspNetCore.SwaggerGen;
//
// namespace API.Configuration.Swagger.Filters;
//
// public class AddAuthHeaderOperationFilter : IOperationFilter
// {
//     public void Apply(OpenApiOperation operation, OperationFilterContext context)
//     {
//         var meta = context.ApiDescription.ActionDescriptor.EndpointMetadata;
//         var isAuthorized = meta.Any(e => e is AuthorizeAttribute);
//         var allowAnonymous = meta.Any(e => e is AllowAnonymousAttribute);
//         
//         if (!isAuthorized || allowAnonymous) return;
//
//         
//         operation.Security = new List<OpenApiSecurityRequirement>
//         {
//             new()
//             {
//                 {
//                     new OpenApiSecuritySchemeReference("", )
//                     new OpenApiSecurityScheme
//                     {
//                         Description = "Cookie",
//                         
//                         Reference = new OpenApiReference
//                         {
//                             Id = "Cookie",
//                             Type = ReferenceType.SecurityScheme
//                         },
//                         Type = SecuritySchemeType.Http,
//                         In = ParameterLocation.Cookie,
//                         Scheme = CookieAuthenticationDefaults.AuthenticationScheme,
//                         
//                         UnresolvedReference = false,
//                     },
//                     new string[] {}
//                 }
//             }
//         };
//         
//         operation.Responses.Add("401", new OpenApiResponse {Description = "Unauthorized"});
//         operation.Responses.Add("403", new OpenApiResponse {Description = "Forbidden"});
//     }
// }