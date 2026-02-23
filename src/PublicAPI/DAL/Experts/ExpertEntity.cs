using System.ComponentModel.DataAnnotations;

namespace DAL.Experts;

public class ExpertEntity
{
    [Key] public Guid Id { get; set; }
}