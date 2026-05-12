using Infrastructure.DTO;

namespace Domain.Employers.DTO;

public record EmployerUpdateEntity(
    string? PasswordHash = null,
    string? Name = null,
    NullablePatch<string>? Email = null,
    NullablePatch<string>? PhoneNumber = null,
    NullablePatch<string>? SiteUrl = null)
{
}