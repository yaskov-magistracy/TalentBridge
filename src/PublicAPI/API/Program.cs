using API.Configuration;
using API.Configuration.Auth;
using API.Configuration.Swagger;
using Application;
using Infrastructure.Configuration.Routes.ModelBinding;
using Infrastructure.Configuration.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(SwaggerConfiguration.Apply);
builder.Services.AddControllers(opt =>
    {
        opt.ModelBinderProviders.Insert(0, new DateOnlyModelBinderProvider());
    })
    .AddJsonOptions(JsonConverters.ConfigureJson);
CookieAuth.Configure(builder.Services);
DI.Register(builder.Services);


var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseMiddleware<ErrorHandlingMiddleware>();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();