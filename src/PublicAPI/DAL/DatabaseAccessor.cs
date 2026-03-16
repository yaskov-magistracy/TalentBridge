using Domain.Candidates;
using Domain.Employers;
using Domain.EmployerTasks;
using Domain.Technologies;
using Domain.Technologies.DTO;
using Microsoft.EntityFrameworkCore;

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

    // TODO: Сделать резолвинг сервисов по требованию
    /// <summary>
    /// Костыль чтобы имитировать Scoped
    /// </summary>
    private void ClearAttachedItems()
    {
        foreach (var entry in dataContext.ChangeTracker.Entries())
        {
            entry.State = EntityState.Detached;
        }
    }

    private async Task AddBaseEntities()
    {
        await technologiesService.AddBatch(TechnologyCreateEntities);
        ClearAttachedItems();
        var (technologies, technologiesCount) = (await technologiesService.Search(new())).Value;
        ClearAttachedItems();
        var candidate = (await candidatesService.Add(new(
            "candidate",
            "candidate",
            "Корнишевский",
            "Антон",
            "Юрьевич",
            "Екатеринбург",
            "Я новенький разработчик тут",
            technologies.Take(5).Select(e => e.Id).ToArray()
        ))).Value;
        ClearAttachedItems();
        var employer = (await employersService.Add(new(
            "employer",
            "employer",
            "ООО Рога-копыта"
        ))).Value;
        ClearAttachedItems();
        var employerTask = await employerTasksService.Add(new(
            "Тестовое задание по каким-то технологиям",
            "Это описание тестового задания",
            "https://github.com/yaskov-magistracy/TalentBridge",
            DateOnly.FromDateTime(DateTime.UtcNow.AddDays(30)),
            employer.Id,
            technologies.Skip(5).Take(5).Select(e => e.Id).ToArray()));
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