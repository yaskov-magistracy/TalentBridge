using DAL;
using DAL.Assignments;
using DAL.Authorization;
using DAL.Candidates;
using DAL.Employers;
using DAL.Experts;
using DAL.Solutions;
using DAL.Technologies;
using Domain.Assignments;
using Domain.Authorization;
using Domain.Candidates;
using Domain.Employers;
using Domain.Experts;
using Domain.Solutions;
using Domain.Technologies;
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

        services.AddScoped<IExpertsRepository, ExpertsRepository>();
        services.AddScoped<IExpertsService, ExpertsService>();

        services.AddScoped<IAssignmentsRepository, AssignmentsRepository>();
        services.AddScoped<IAssignmentsService, AssignmentsService>();

        services.AddScoped<ITechnologiesRepository, TechnologiesRepository>();
        services.AddScoped<ITechnologiesService, TechnologiesService>();

        services.AddScoped<ISolutionsRepository, SolutionsRepository>();
        services.AddScoped<ISolutionsService, SolutionsService>();
    }
}