using System.ComponentModel.DataAnnotations;
using DAL.Assignments;
using DAL.Experts;

namespace DAL.Employers;

internal class EmployerEntity
{
    [Key] public Guid Id { get; set; }
    public string Login { get; set; }
    public string PasswordHash { get; set; }
    public string Name { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public string? SiteUrl { get; set; }
    
    public List<AssignmentEntity>? Assignments { get; set; }
    public List<ExpertEntity>? Experts { get; set; }
}