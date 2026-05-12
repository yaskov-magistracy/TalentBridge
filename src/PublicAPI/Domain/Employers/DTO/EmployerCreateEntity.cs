namespace Domain.Employers.DTO;

public record EmployerCreateEntity(
    string Login,
    string PasswordHash,
    string Name,
    string? Email,
    string? PhoneNumber,
    string? SiteUrl
)
{
    
}