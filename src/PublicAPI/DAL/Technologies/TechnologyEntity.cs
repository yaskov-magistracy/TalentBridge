using System.ComponentModel.DataAnnotations;
using DAL.Candidates;

namespace DAL.Technologies;

internal class TechnologyEntity : IEntity
{
    [Key]
    public Guid Id { get; set; }
    public string Name { get; set; }
    
    public List<CandidateEntity>? Candidates { get; set; }
}