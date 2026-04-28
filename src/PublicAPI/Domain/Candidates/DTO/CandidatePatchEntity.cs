using Infrastructure.DTO;

namespace Domain.Candidates.DTO;

public record CandidatePatchEntity(
    string? PasswordHash = null,
    string? Surname = null,
    string? Name = null,
    NullablePatch<string>? Patronymic = null,
    string? City = null,
    string? About = null,
    float? Rating = null,
    RelationsPatch? Technologies = null)
{
}