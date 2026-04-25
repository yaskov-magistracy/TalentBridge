using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DAL.Employers;
using DAL.ExpertReviews;

namespace DAL.Experts;

internal class ExpertEntity
{
    [Key] public Guid Id { get; set; }
    public string Login { get; set; }
    public string PasswordHash { get; set; }
    public string Surname { get; set; }
    public string Name { get; set; }
    public string? Patronymic { get; set; }
    
    [ForeignKey(nameof(Employer))] public Guid EmployerId { get; set; }
    public EmployerEntity Employer { get; set; }
    
    public List<ExpertReviewEntity>? ExpertReviews { get; set; }
}