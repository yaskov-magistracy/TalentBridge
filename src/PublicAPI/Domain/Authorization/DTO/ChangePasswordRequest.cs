namespace Domain.Authorization.DTO;

public record ChangePasswordRequest(
    string OldPassword,
    string NewPassword)
{
    
}