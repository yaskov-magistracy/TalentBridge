namespace Infrastructure.DTO.Search;

public abstract record BaseSearchRequest<T>(
    int Take = 100,
    int Skip = 0)
{
}