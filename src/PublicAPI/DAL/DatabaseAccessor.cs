using Domain.Candidates;
using Domain.Employers;
using Domain.EmployerTasks;
using Domain.Technologies;
using Domain.Technologies.DTO;

namespace DAL;

public class DatabaseAccessor(
    DataContext dataContext,
    IEmployersService employersService,
    ICandidatesService candidatesService,
    ITechnologiesService technologiesService,
    IEmployerTasksService employerTasksService
)
{
    public async Task RecreateDatabase()
    {
        await dataContext.Database.EnsureDeletedAsync();
        await dataContext.Database.EnsureCreatedAsync();
        await AddBaseEntities();
    }

    private async Task AddBaseEntities()
    {
        await technologiesService.AddBatch(TechnologyCreateEntities);
        var (technologies, technologiesCount) = (await technologiesService.Search(new())).Value;
        var candidate = (await candidatesService.Add(new(
            "candidate",
            "candidate"))).Value;
        var employer = (await employersService.Add(new(
            "employer",
            "employer"))).Value;
        await employerTasksService.Add(new(
            "Тестовое задание по каким-то технологиям",
            "Это описание тестового задания",
            "https://github.com/yaskov-magistracy/TalentBridge",
            DateOnly.FromDateTime(DateTime.UtcNow.AddDays(30)),
            employer.Id));
    }

    private static readonly TechnologyCreateEntity[] TechnologyCreateEntities =
    [
        new("Node.js"),
        new("Express"),
        new("PostgreSQL"),
        new("Docker"),
        new("React"),
        new("TypeScript"),
        new("JavaScript"),
        new("Tailwind"),
        new("Python"),
        new("FastAPI"),
        new("Redis"),
        new("C#")
    ];
}