using Infrastructure.DTO;

namespace Domain.Solutions.DTO;

public record SolutionPatchEntity(
    string? SolutionUrl = null,
    SolutionState? State = null,
    DateOnly? StartedAt = null,
    SolutionTeamPatchEntity? Team = null,
    RelationsPatch? Candidates = null,
    RelationsPatch? CandidatesJoinRequested = null,
    string? ExpertReview = null,
    Guid? ExpertId = null
);

public record SolutionTeamPatchEntity(
    string? Name,
    string? Description
);
