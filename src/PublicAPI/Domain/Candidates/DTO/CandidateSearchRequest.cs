using Infrastructure.DTO.Search;
using Infrastructure.DTO.Search.Ordering;

namespace Domain.Candidates.DTO;

public record CandidateSearchRequest(
    CandidateSearchOrdering? Ordering = null,
    int Take = 100,
    int Skip = 0
) : BaseSearchRequest(Take, Skip);

public record CandidateSearchOrdering(
    CandidateSearchOrderingField Field,
    SearchOrderingDirection Direction = SearchOrderingDirection.Descending
) : SearchOrdering(Direction);

public enum CandidateSearchOrderingField
{
    Rating,
}