namespace Infrastructure.DTO.Search;

public abstract record BaseSearchRequest(
    int Take = 100,
    int Skip = 0)
{
}