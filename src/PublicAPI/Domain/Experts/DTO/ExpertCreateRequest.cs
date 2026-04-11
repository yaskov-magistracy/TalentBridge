namespace Domain.Experts.DTO;

public record ExpertCreateRequest(
    string Login,
    string Password,
    string Surname,
    string Name,
    string? Patronymic,
    Guid EmployerId
);