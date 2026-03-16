using Infrastructure.DTO;

namespace API.Candidates.DTO;

public record CandidatePatchApiRequest(
    string? Surname = null,
    string? Name = null,
    NullablePatch<string>? Patronymic = null,
    string? City = null,
    string? About = null,
    RelationsPatch? Technologies = null)
{
}