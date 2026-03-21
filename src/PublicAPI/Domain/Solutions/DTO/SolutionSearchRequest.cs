using Infrastructure.DTO.Search;

namespace Domain.Solutions.DTO;

public record SolutionSearchRequest(
    Guid? AssignmentId = null,
    Guid? CandidateId = null,
    int Take = 100,
    int Skip = 0
) : BaseSearchRequest<SolutionBase>(Take, Skip)
{
}
