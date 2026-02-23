namespace Domain.Authorization;

public record Account(
    Guid Id,
    string Login,
    string PasswordHash,
    AccountRole Role)
{
}