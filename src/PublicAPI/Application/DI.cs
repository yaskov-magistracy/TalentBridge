using DAL;
using DAL.Authorization;
using DAL.Candidates;
using DAL.Employers;
using Domain.Authorization;
using Domain.Candidates;
using Domain.Employers;
using Microsoft.Extensions.DependencyInjection;

namespace Application;

public static class DI
{
    public static void Register(IServiceCollection services)
    {
        services.AddSingleton<DalConfig>(_ => new DalConfig());
        services.AddDbContext<DataContext>();
        services.AddScoped<DatabaseAccessor>();

        services.AddSingleton<IPasswordHasher, PasswordHasher>();
        services.AddScoped<IAccountsRepository, AccountsRepository>();
        services.AddScoped<IAuthorizationService, AuthorizationService>();
        
        services.AddScoped<ICandidatesRepository, CandidatesRepository>();
        services.AddScoped<ICandidatesService, CandidatesService>();
        
        services.AddScoped<IEmployersRepository, EmployersRepository>();
        services.AddScoped<IEmployersService, EmployersService>();
    }
}