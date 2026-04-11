namespace Domain.Experts.DTO;

public record ExpertCreateEntity(
    string Login,
    string PasswordHash,
    string Surname,
    string Name,
    string? Patronymic, 
    Guid EmployerId)
{
    
}