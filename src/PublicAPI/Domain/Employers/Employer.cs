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