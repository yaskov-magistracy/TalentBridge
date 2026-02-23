using System.Reflection;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace API.Configuration.Swagger;

public static class SwaggerConfiguration
{
    public static void Apply(SwaggerGenOptions opt)
    {
        AddXmlComments(opt);
    }

    private static void AddXmlComments(SwaggerGenOptions opt)
    {
        var xmlFilename = $"{Assembly.GetEntryAssembly()!.GetName().Name}.xml";
        opt.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
    }
}