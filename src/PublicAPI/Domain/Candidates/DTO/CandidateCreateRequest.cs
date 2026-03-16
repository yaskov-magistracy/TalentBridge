namespace Domain.Candidates.DTO;

public record CandidateCreateRequest(
    string Login,
    string Password,
    string Surname,
    string Name,
    string? Patronymic,
    string City,
    string About,
    Guid[]? Technologies)
{
    
}