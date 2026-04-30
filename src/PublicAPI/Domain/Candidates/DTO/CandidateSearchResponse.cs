using Infrastructure.DTO.Search;

namespace Domain.Candidates.DTO;

public record CandidateSearchResponse(
    ICollection<CandidateFullInfo> Items,
    int TotalCount
    ) : BaseSearchResponse<CandidateFullInfo>(Items, TotalCount)
{
    
}