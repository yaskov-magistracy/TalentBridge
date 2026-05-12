namespace Domain.Employers;

public record Employer(
    Guid Id,
    string Login,
    string Name,
    string? Email,
    string? Number,
    string? SiteUrl)
{
}

public record EmployerFull(
    Guid Id,
    string Login,
    string Name,
    string? Email,
    string? Number,
    string? SiteUrl,
    int AssignmentsCount,
    int CompletedSolutions
) : Employer(Id, Login, Name, Email, Number, SiteUrl);