using Domain.Technologies;

namespace Domain.Candidates;

public record Candidate(
    Guid Id,
    string Login,
    string Surname,
    string Name,
    string? Patronymic,
    string City,
    string About
);

public record CandidateFullInfo(
    Guid Id,
    string Login,
    string Surname,
    string Name,
    string? Patronymic,
    string City,
    string About,
    Technology[]? Technologies
) : Candidate(Id, Login, Surname, Name, Patronymic, City, About);