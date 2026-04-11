using Infrastructure.DTO;

namespace Domain.Experts.DTO;

public record ExpertUpdateEntity(
    string? PasswordHash = null,
    string? Surname = null,
    string? Name = null,
    NullablePatch<string>? Patronymic = null
)
{
    
}