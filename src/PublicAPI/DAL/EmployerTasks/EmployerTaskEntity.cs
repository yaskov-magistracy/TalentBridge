using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DAL.Employers;
using DAL.Solutions;
using DAL.Technologies;

namespace DAL.EmployerTasks;

internal class EmployerTaskEntity
{
    [Key]
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string? TemplateUrl { get; set; }
    public DateOnly DeadLine { get; set; }
    
    [ForeignKey(nameof(Employer))] public Guid EmployerId { get; set; }
    public EmployerEntity Employer { get; set; }
    
    public List<TechnologyEntity>? Technologies { get; set; }
    public List<SolutionEntity>? Solutions { get; set; }
}