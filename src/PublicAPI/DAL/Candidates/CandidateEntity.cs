using System.ComponentModel.DataAnnotations;
using DAL.Solutions;
using DAL.Technologies;

namespace DAL.Candidates;

internal class CandidateEntity : IEntity
{
    [Key] public Guid Id { get; set; }
    public string Login { get; set; }
    public string PasswordHash { get; set; }
    public string Surname { get; set; }
    public string Name { get; set; }
    public string? Patronymic { get; set; }
    public string City { get; set; }
    public string About { get; set; }
    public float Rating { get; set; }
    public List<TechnologyEntity>? Technologies { get; set; }
    public List<SolutionEntity>? Solutions { get; set; }
    public List<SolutionEntity>? SolutionsOwned { get; set; }
    public List<SolutionEntity>? SolutionsJoinRequested { get; set; }
}