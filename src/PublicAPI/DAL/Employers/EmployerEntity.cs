using System.ComponentModel.DataAnnotations;

namespace DAL.Employers;

public class EmployerEntity
{
    [Key] public Guid Id { get; set; }
    public string Login { get; set; }
    public string PasswordHash { get; set; }
}