using System.ComponentModel.DataAnnotations;

namespace DAL.Technologies;

internal class TechnologyEntity
{
    [Key]
    public Guid Id { get; set; }
    public string Name { get; set; }
}