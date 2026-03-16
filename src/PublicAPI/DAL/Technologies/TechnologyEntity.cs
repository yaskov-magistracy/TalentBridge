using System.ComponentModel.DataAnnotations;
using DAL.Candidates;
using DAL.EmployerTasks;

namespace DAL.Technologies;

internal class TechnologyEntity : IEntity
{
    [Key]
    public Guid Id { get; set; }
    public string Name { get; set; }
    
    public List<CandidateEntity>? Candidates { get; set; }
    public List<EmployerTaskEntity>? EmployerTasks { get; set; }
}