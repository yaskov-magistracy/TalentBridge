using Domain.Assignments;
using Domain.Candidates;
using Domain.Employers;
using Domain.Experts;
using Domain.Solutions;
using Domain.Solutions.DTO;
using Domain.Technologies;
using Domain.Technologies.DTO;
using Microsoft.EntityFrameworkCore;

namespace DAL;

public class DatabaseAccessor(
    DataContext dataContext,
    IEmployersService employersService,
    ICandidatesService candidatesService,
    ITechnologiesService technologiesService,
    IAssignmentsService assignmentsService,
    ISolutionsService solutionsService,
    IExpertsService expertsService
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
        var candidate2 = (await candidatesService.Add(new(
            "candidate2",
            "candidate2",
            "Бушуев",
            "Арсений",
            "Игнатьевич",
            "Москва",
            "Опыт в пэт-проектах полгода. Делал телеграм-ботов на аутсорсе",
            technologies.Take(3).Select(e => e.Id).ToArray()
        ))).Value;
        ClearAttachedItems();
        var employer = (await employersService.Add(new(
            "employer",
            "employer",
            "ООО Рога-копыта"
        ))).Value;
        ClearAttachedItems();
        var expert = (await expertsService.Add(new(
            "expert",
            "expert",
            "Экспертов",
            "Эксперт",
            "Экспертович",
            employer.Id
        ))).Value;
        ClearAttachedItems();
        var soloAssignment = (await assignmentsService.Add(new(
            "Тестовое задание для одного человека",
            "Это описание тестового задания для одного человека",
            "https://github.com/yaskov-magistracy/TalentBridge",
            DateOnly.FromDateTime(DateTime.UtcNow.AddDays(30)),
            1,
            [1],
            employer.Id,
            technologies.Skip(5).Take(5).Select(e => e.Id).ToArray()
        ))).Value;
        ClearAttachedItems();
        var teamAssignment = (await assignmentsService.Add(new(
            "Тестовое задание для команды",
            "Это описание тестового задания для команды",
            "https://github.com/yaskov-magistracy/TalentBridge",
            DateOnly.FromDateTime(DateTime.UtcNow.AddDays(15)),
            2,
            [1],
            employer.Id,
            technologies.Skip(3).Take(4).Select(e => e.Id).ToArray()
        ))).Value;
        ClearAttachedItems();
        await CreateSolutionAndGoToReview(soloAssignment.Id, candidate.Id, expert.Id, 
            new("В целом неплохое решение. Я бы взял его на работу", 9, SolutionSubmitReviewResultState.Done));
        ClearAttachedItems();
        await CreateSolutionAndGoToReview(soloAssignment.Id, candidate.Id, expert.Id, 
                new("Плохое решение. Много недочётов. Я бы не брал", 3, SolutionSubmitReviewResultState.Failed));
        ClearAttachedItems();
        var teamSolution = (await solutionsService.Add(new(
            teamAssignment.Id, 
            candidate.Id,
            new TeamCreateRequest("Супер команда для проекта", "Делаем крутые штуки")
        ))).Value;
        ClearAttachedItems();
        await solutionsService.Join(candidate2.Id, teamSolution.Id);
        ClearAttachedItems();
        await solutionsService.Start(candidate.Id, teamSolution.Id);
        ClearAttachedItems();
        var notFullTeamSolution = (await solutionsService.Add(new(
            teamAssignment.Id, 
            candidate.Id,
            new TeamCreateRequest("Ещё не собранная команда", "Ищу интересных людей для работы вместе")
        ))).Value;
        ClearAttachedItems();
        await solutionsService.JoinRequest(candidate2.Id, notFullTeamSolution.Id);
        ClearAttachedItems();
    }

    private async Task CreateSolutionAndGoToReview(Guid assignmentId, Guid candidateId, Guid expertId, SolutionSubmitReviewRequest submitReviewRequestRequest)
    {
        ClearAttachedItems();
        var soloSolution = (await solutionsService.Add(new(
            assignmentId, 
            candidateId,
            null
        ))).Value;
        ClearAttachedItems();
        await solutionsService.Start(candidateId, soloSolution.Id);
        ClearAttachedItems();
        await solutionsService.SendToReview(candidateId, soloSolution.Id);
        ClearAttachedItems();
        await solutionsService.SubmitReview(expertId, soloSolution.Id, submitReviewRequestRequest);
        ClearAttachedItems();
    }

    private static readonly TechnologyCreateEntity[] TechnologyCreateEntities =
    [
        // Languages
        new("JavaScript"),
        new("TypeScript"),
        new("Python"),
        new("Java"),
        new("C#"),
        new("Go"),
        new("Rust"),
        new("PHP"),
        new("C++"),
        new("Kotlin"),
        new("Swift"),
    
        // Backend Frameworks
        new("Node.js"),
        new("Express"),
        new("Spring Boot"),
        new("Django"),
        new("FastAPI"),
        new("ASP.NET Core"),
        new("Laravel"),
    
        // Frontend & Mobile
        new("React"),
        new("Vue.js"),
        new("Angular"),
        new("Next.js"),
        new("Tailwind"),
        new("Flutter"),
    
        // Databases
        new("SQL"),
        new("PostgreSQL"),
        new("MySQL"),
        new("MongoDB"),
        new("Redis"),
        new("SQLite"),
        new("Kibana"),
        new("Elasticsearch"),
        new("Microsoft SQL Server"),
    
        // Infrastructure & DevOps
        new("Docker"),
        new("Kubernetes"),
        new("Terraform"),
        new("Ansible"),
        new("GitHub Actions"),
        
        // Cloud Platforms
        new("AWS"),
        new("Azure"),
        new("Google Cloud Platform"),
        
        // Architecture & Tools
        new("Kafka"),
        new("RabbitMQ"),
        new("gRPC"),
        new("GraphQL"),
        new("Microservices"),
    ];
}