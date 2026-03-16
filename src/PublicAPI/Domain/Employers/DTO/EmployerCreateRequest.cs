namespace Domain.Employers.DTO;

public record EmployerCreateRequest(
    string Login,
    string Password,
    string Name)
{
    
}