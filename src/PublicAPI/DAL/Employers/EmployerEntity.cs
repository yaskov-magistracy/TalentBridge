using System.ComponentModel.DataAnnotations;
using DAL.Assignments;

namespace DAL.Employers;

internal class EmployerEntity
{
    [Key] public Guid Id { get; set; }
    public string Login { get; set; }
    public string PasswordHash { get; set; }
    public string Name { get; set; }
    
    public List<AssignmentEntity>? Assignments { get; set; }
}