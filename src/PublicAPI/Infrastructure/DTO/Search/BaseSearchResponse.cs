namespace Infrastructure.DTO.Search;

public abstract record BaseSearchResponse<T>(
    ICollection<T> Items,
    int TotalCount
);