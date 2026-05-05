namespace Infrastructure.DTO.Search.Ordering;

public record SearchOrdering(SearchOrderingDirection Direction);

public enum SearchOrderingDirection
{
    Ascending,
    Descending
}