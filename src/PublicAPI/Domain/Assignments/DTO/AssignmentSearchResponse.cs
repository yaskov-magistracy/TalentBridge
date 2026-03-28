using Infrastructure.DTO.Search;

namespace Domain.Assignments.DTO;

public record AssignmentSearchResponse(
    ICollection<AssignmentFullInfo> Items, 
    int TotalCount
) : BaseSearchResponse<AssignmentFullInfo>(Items, TotalCount)
{
    
}