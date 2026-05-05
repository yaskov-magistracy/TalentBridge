using DAL.Solutions;
using DAL.Technologies;
using Domain.Candidates;
using Domain.Candidates.DTO;

namespace DAL.Candidates;

internal static class CandidatesMapper
{
    public static Candidate ToDomain(CandidateEntity entity)
        => new(
            entity.Id,
            entity.Login,
            entity.Surname,
            entity.Name,
            entity.Patronymic,
            entity.City,
            entity.About,
            entity.Rating
        );

    public static CandidateFullInfo ToDomainFull(CandidateEntity entity)
    {
        var solutions = entity.Solutions ?? [];
        var doneSolutions = solutions.Where(e => e.State == SolutionEntityState.Done).ToArray();
        var doneSolutionsCount = doneSolutions.Length;
        var failedSolutions = solutions.Where(e => e.State == SolutionEntityState.Done).ToArray();
        var failedSolutionsCount = failedSolutions.Length;
        float successRate = 0f;
        float averageScore = 0f;
        if (doneSolutionsCount != 0 || failedSolutionsCount != 0)
        {
            successRate = MathF.Max(1, doneSolutionsCount) / MathF.Max(1, failedSolutionsCount);
            var totalScore = (float)doneSolutions.Concat(failedSolutions)
                .Sum(e => e.ExpertReviews!.OrderByDescending(review => review.CreatedAt).First().Score);
            averageScore = totalScore / (doneSolutionsCount + failedSolutionsCount);
        }

        return new(
            entity.Id,
            entity.Login,
            entity.Surname,
            entity.Name,
            entity.Patronymic,
            entity.City,
            entity.About,
            entity.Rating,
            entity.Technologies?.Select(TechnologiesMapper.ToDomain).ToArray(),
            entity.Solutions?.Where(e => e.MedalGrantedAt != null).Count() ?? 0, 
            doneSolutions.Select(e => e.Assignment.Name).ToArray(),
            averageScore,
            MathF.Round(successRate * 100)
        );
    }

    public static CandidateEntity ToEntity(CandidateCreateEntity createEntity)
        => new()
        {
            Id = Guid.Empty,
            Login = createEntity.Login,
            PasswordHash = createEntity.PasswordHash,
            Surname = createEntity.Surname,
            Name = createEntity.Name,
            Patronymic = createEntity.Patronymic,
            City = createEntity.City,
            About = createEntity.About,
            Rating = 0,
            Technologies = createEntity.Technologies?.Select(e => new TechnologyEntity()
            {
                Id = e
            }).ToList(),
        };
}