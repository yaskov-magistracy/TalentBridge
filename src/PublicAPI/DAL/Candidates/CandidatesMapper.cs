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
        var doneSolutions = solutions.Count(e => e.State == SolutionEntityState.Done);
        var failedSolutions = solutions.Count(e => e.State == SolutionEntityState.Failed);
        var successRate = doneSolutions != 0 || failedSolutions != 0
            ? MathF.Max(1, doneSolutions) / MathF.Max(1, failedSolutions)
            : 0;
        
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
            doneSolutions,
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