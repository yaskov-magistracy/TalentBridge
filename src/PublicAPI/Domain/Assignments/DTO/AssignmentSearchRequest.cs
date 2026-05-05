using Infrastructure.DTO.Search;
using Infrastructure.DTO.Search.Ranges;

namespace Domain.Assignments.DTO;

public record AssignmentSearchRequest(
    Guid? EmployerId = null,
    string? Text = null,
    List<Guid>? ExcludedIds = null,
    List<Guid>? TechnologiesIds = null,
    bool? IsGrouped = null,
    DateOnlySearchQuery? DeadLineRangeIncluded = null,
    bool IncludePrivate = false,
    int Take = 100,
    int Skip = 0
) : BaseSearchRequest(Take, Skip)
{
    
}