namespace Infrastructure.DTO.Search.Ordering;

public interface IOrderingSearchQuery
{
    OrderingSearchDirection Direction { get; set; }
}