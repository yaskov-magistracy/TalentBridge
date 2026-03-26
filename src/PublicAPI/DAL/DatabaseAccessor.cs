using Domain.Assignments;
using Domain.Candidates;
using Domain.Employers;
using Domain.Solutions;
using Domain.Technologies;
using Domain.Technologies.DTO;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace DAL;

public class DatabaseAccessor(
    DataContext dataContext,
    IEmployersService employersService,
    ICandidatesService candidatesService,
    ITechnologiesService technologiesService,
    IAssignmentsService assignmentsService,
    ISolutionsService solutionsService
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
        var soloAssignment = (await assignmentsService.Add(new(
            "Тестовое задание для одного человека",
            "Это описание тестового задания для одного человека",
            "https://github.com/yaskov-magistracy/TalentBridge",
            DateOnly.FromDateTime(DateTime.UtcNow.AddDays(30)),
            1,
            employer.Id,
            technologies.Skip(5).Take(5).Select(e => e.Id).ToArray()
        ))).Value;
        ClearAttachedItems();
        var teamAssignment = (await assignmentsService.Add(new(
            "Тестовое задание для команды",
            "Это описание тестового задания для команды",
            "https://github.com/yaskov-magistracy/TalentBridge",
            DateOnly.FromDateTime(DateTime.UtcNow.AddDays(15)),
            4,
            employer.Id,
            technologies.Skip(3).Take(4).Select(e => e.Id).ToArray()
        ))).Value;
        ClearAttachedItems();
        var soloSolution = (await solutionsService.Add(new(
            soloAssignment.Id, 
            candidate.Id
        ))).Value;
        ClearAttachedItems();
        var teamSolution = (await solutionsService.Add(new(
            teamAssignment.Id, 
            candidate.Id
        ))).Value;
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