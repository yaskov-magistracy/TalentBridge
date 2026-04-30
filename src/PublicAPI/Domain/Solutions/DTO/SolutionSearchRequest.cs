using Infrastructure.DTO.Search;

namespace Domain.Solutions.DTO;

public record SolutionSearchRequest(
    Guid? AssignmentId = null,
    List<Guid>? TechnologiesIds = null,
    List<Guid>? ExcludeAssignmentsIds = null,
    Guid? CandidateId = null,
    Guid? ExcludeCandidateId = null,
    Guid? CandidateOwnerId = null,
    Guid? ExcludeCandidateOwnerId = null,
    Guid? CandidateJoinRequestedId = null,
    Guid? ExcludeCandidateJoinRequestedId = null,
    bool? IsAvailableToJoin = null,
    SolutionState? State = null,
    bool? HasMedal = null,
    string? Text = null,
    int Take = 100,
    int Skip = 0
) : BaseSearchRequest(Take, Skip)
{
}
