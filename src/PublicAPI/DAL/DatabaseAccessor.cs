using Domain.Assignments;
using Domain.Candidates;
using Domain.Employers;
using Domain.Experts;
using Domain.Solutions;
using Domain.Solutions.DTO;
using Domain.Technologies;
using Domain.Technologies.DTO;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace DAL;

public class DatabaseAccessor(
    DataContext dataContext,
    IServiceScopeFactory serviceScopeFactory
)
{
    private T Get<T>() where T : notnull => serviceScopeFactory.CreateScope().ServiceProvider.GetRequiredService<T>();
    private IEmployersService EmployersService => Get<IEmployersService>();
    private ITechnologiesService TechnologiesService => Get<ITechnologiesService>();
    private ICandidatesService CandidatesService => Get<ICandidatesService>();
    private IAssignmentsService  AssignmentsService => Get<IAssignmentsService>();
    private ISolutionsService SolutionsService => Get<ISolutionsService>();
    private IExpertsService ExpertsService => Get<IExpertsService>();
    
    public async Task RecreateDatabase()
    {
        await dataContext.Database.EnsureDeletedAsync();
        await dataContext.Database.EnsureCreatedAsync();
        await AddBaseEntities();
    }

    private async Task AddBaseEntities()
    {
        await TechnologiesService.AddBatch(TechnologyCreateEntities);
        var (technologies, technologiesCount) = (await TechnologiesService.Search(new())).Value;
        var candidate = (await CandidatesService.Add(new(
            "candidate",
            "candidate",
            "Корнишевский",
            "Антон",
            "Юрьевич",
            "Екатеринбург",
            "Я новенький разработчик тут",
            technologies.Take(5).Select(e => e.Id).ToArray()
        ))).Value;
        var candidate2 = (await CandidatesService.Add(new(
            "candidate2",
            "candidate2",
            "Бушуев",
            "Арсений",
            "Игнатьевич",
            "Москва",
            "Опыт в пэт-проектах полгода. Делал телеграм-ботов на аутсорсе",
            technologies.Take(3).Select(e => e.Id).ToArray()
        ))).Value;
        var employer = (await EmployersService.Add(new(
            "employer",
            "employer",
            "ООО Рога-копыта"
        ))).Value;
        var expert = (await ExpertsService.Add(new(
            "expert",
            "expert",
            "Экспертов",
            "Эксперт",
            "Экспертович",
            employer.Id
        ))).Value;
        var soloAssignment = (await AssignmentsService.Add(new(
            "Тестовое задание для одного человека",
            "Это описание тестового задания для одного человека",
            "https://github.com/yaskov-magistracy/TalentBridge",
            DateOnly.FromDateTime(DateTime.UtcNow.AddDays(30)),
            1,
            AssignmentDifficulty.Normal,
            [1],
            1,
            employer.Id,
            technologies.Skip(5).Take(5).Select(e => e.Id).ToArray()
        ))).Value;
        var teamAssignment = (await AssignmentsService.Add(new(
            "Тестовое задание для команды c несколькими иттерациями",
            "Это описание тестового задания для команды",
            "https://github.com/yaskov-magistracy/TalentBridge",
            DateOnly.FromDateTime(DateTime.UtcNow.AddDays(15)),
            2,
            AssignmentDifficulty.Hard,
            [1, 0.8f],
            1,
            employer.Id,
            technologies.Skip(3).Take(4).Select(e => e.Id).ToArray()
        ))).Value;
        await CreateSolutionAndGoToReview(soloAssignment.Id, candidate.Id, expert.Id, 
            new("В целом неплохое решение. Я бы взял его на работу", 9, SolutionSubmitReviewResultState.Done, true));
        await CreateSolutionAndGoToReview(soloAssignment.Id, candidate.Id, expert.Id, 
                new("Плохое решение. Много недочётов. Я бы не брал", 3, SolutionSubmitReviewResultState.Failed, false));
        await CreateTeamSolutionAndGoToReview(teamAssignment.Id, candidate.Id, candidate2.Id, expert.Id, 
            new ("В целом неплохо. Нужно доделать транзакции и закрыть безопасность", 7, SolutionSubmitReviewResultState.Failed, false));
        var notFullTeamSolution = (await SolutionsService.Add(new(
            teamAssignment.Id, 
            candidate.Id,
            new TeamCreateRequest("Ещё не собранная команда", "Ищу интересных людей для работы вместе")
        ))).Value;
        await SolutionsService.JoinRequest(candidate2.Id, notFullTeamSolution.Id);
    }

    private async Task CreateSolutionAndGoToReview(Guid assignmentId, Guid candidateId, Guid expertId, SolutionSubmitReviewRequest submitReviewRequestRequest)
    {
        var soloSolution = (await SolutionsService.Add(new(
            assignmentId, 
            candidateId,
            null
        ))).Value;
        await SolutionsService.Start(candidateId, soloSolution.Id);
        await SolutionsService.SendToReview(candidateId, soloSolution.Id);
        await SolutionsService.SubmitReview(expertId, soloSolution.Id, submitReviewRequestRequest);
    }
    
    private async Task CreateTeamSolutionAndGoToReview(
        Guid teamAssignmentId, Guid candidateId, Guid candidate2Id, Guid expertId, SolutionSubmitReviewRequest submitReviewRequestRequest)
    {
        var teamSolution = (await SolutionsService.Add(new(
            teamAssignmentId, 
            candidateId,
            new TeamCreateRequest("Супер команда для проекта", "Делаем крутые штуки")
        ))).Value;
        await SolutionsService.Join(candidate2Id, teamSolution.Id);
        await SolutionsService.Start(candidateId, teamSolution.Id);
        await SolutionsService.SendToReview(candidateId, teamSolution.Id);
        await SolutionsService.SubmitReview(expertId, teamSolution.Id, submitReviewRequestRequest);
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