namespace Infrastructure.DTO;

public record RelationsPatch(
    List<Guid>? ToRemove = null,
    List<Guid>? ToAdd = null
)
{
    
}