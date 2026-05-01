using Domain.Technologies;

namespace Domain.Candidates;

public record Candidate(
    Guid Id,
    string Login,
    string Surname,
    string Name,
    string? Patronymic,
    string City,
    string About,
    float Rating
);

public record CandidateFullInfo(
    Guid Id,
    string Login,
    string Surname,
    string Name,
    string? Patronymic,
    string City,
    string About,
    float Rating,
    Technology[]? Technologies,
    int MedalsCount,
    string[] SolutionsCompleted,
    float AverageScore,
    float SuccessRate
) : Candidate(Id, Login, Surname, Name, Patronymic, City, About, Rating);