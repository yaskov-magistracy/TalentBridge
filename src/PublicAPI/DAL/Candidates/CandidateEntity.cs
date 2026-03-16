using System.ComponentModel.DataAnnotations;
using DAL.Technologies;

namespace DAL.Candidates;

internal class CandidateEntity
{
    [Key] public required Guid Id { get; set; }
    public required string Login { get; set; }
    public required string PasswordHash { get; set; }
    public required string Surname { get; set; }
    public required string Name { get; set; }
    public required string? Patronymic { get; set; }
    public required string City { get; set; }
    public required string About { get; set; }
    public required List<TechnologyEntity>? Technologies { get; set; }
}