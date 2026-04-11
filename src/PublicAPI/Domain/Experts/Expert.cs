using Domain.Employers;

namespace Domain.Experts;

public record Expert(
    Guid Id,
    string Surname,
    string Name,
    string? Patronymic
);

public record ExpertFullInfo(
    Guid Id,
    string Surname,
    string Name,
    string? Patronymic,
    Employer Employer
) : Expert(Id, Surname, Name, Patronymic);