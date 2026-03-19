using Infrastructure.DTO.Search;

namespace Domain.Solutions.DTO;

public record SolutionSearchResponse(
    ICollection<SolutionFullInfo> Items,
    int TotalCount
) : BaseSearchResponse<SolutionFullInfo>(Items, TotalCount)
{
}
