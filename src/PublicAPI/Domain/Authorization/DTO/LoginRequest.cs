namespace Domain.Authorization.DTO;

public record LoginRequest(
    string Login,
    string Password)
{
    
}