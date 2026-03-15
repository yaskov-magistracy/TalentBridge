using Infrastructure.DTO.Search;

namespace Domain.Technologies.DTO;

public record TechnologySearchResponse(
    ICollection<Technology> Items,
    int TotalCount
) : BaseSearchResponse<Technology>(Items, TotalCount)
{
    
}