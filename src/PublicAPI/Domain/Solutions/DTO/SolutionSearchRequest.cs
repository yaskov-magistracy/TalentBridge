using Infrastructure.DTO.Search;

namespace Domain.Solutions.DTO;

public record SolutionSearchRequest(
    Guid? AssignmentId = null,
    Guid? CandidateId = null,
    Guid? CandidateOwnerId = null,
    Guid? CandidateJoinRequestedId = null,
    string? Text = null,
    int Take = 100,
    int Skip = 0
) : BaseSearchRequest<Solution>(Take, Skip)
{
}
