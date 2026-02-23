namespace Domain.Candidates.DTO;

public record CandidateCreateEntity(
    string Login,
    string PasswordHash)
{
    
}