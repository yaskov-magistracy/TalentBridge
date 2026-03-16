namespace Domain.Employers.DTO;

public record EmployerUpdateEntity(
    string? PasswordHash = null,
    string? Name = null)
{
}