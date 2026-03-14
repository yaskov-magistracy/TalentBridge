using System.ComponentModel.DataAnnotations;
using DAL.EmployerTasks;

namespace DAL.Employers;

internal class EmployerEntity
{
    [Key] public Guid Id { get; set; }
    public string Login { get; set; }
    public string PasswordHash { get; set; }
    
    public List<EmployerTaskEntity>? EmployerTasks { get; set; }
}