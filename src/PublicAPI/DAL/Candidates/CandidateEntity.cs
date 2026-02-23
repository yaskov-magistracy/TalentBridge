using System.ComponentModel.DataAnnotations;

namespace DAL.Candidates;

public class CandidateEntity
{
    [Key] public Guid Id { get; set; }
    public string Login { get; set; }
    public string PasswordHash { get; set; }
}