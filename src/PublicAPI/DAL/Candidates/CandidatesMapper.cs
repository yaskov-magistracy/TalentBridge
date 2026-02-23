using Domain.Candidates;
using Domain.Candidates.DTO;

namespace DAL.Candidates;

internal static class CandidatesMapper
{
    public static Candidate ToDomain(CandidateEntity entity)
        => new(entity.Id,
            entity.Login);

    public static CandidateEntity ToEntity(CandidateCreateEntity createEntity)
        => new()
        {
            Login = createEntity.Login,
            PasswordHash = createEntity.PasswordHash,
        };
}