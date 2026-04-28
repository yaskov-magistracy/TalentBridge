using Domain.Technologies.DTO;

namespace Domain.Candidates.DTO;

public record CandidateCreateEntity(
    string Login,
    string PasswordHash,
    string Surname,
    string Name,
    string? Patronymic,
    string City,
    string About,
    Guid[]? Technologies)
{
    
}