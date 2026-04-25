using Infrastructure.DTO;

namespace Domain.Solutions.DTO;

public record SolutionPatchEntity(
    string? SolutionUrl = null,
    SolutionState? State = null,
    DateOnly? StartedAt = null,
    SolutionTeamPatchEntity? Team = null,
    RelationsPatch? Candidates = null,
    RelationsPatch? CandidatesJoinRequested = null
);

public record SolutionTeamPatchEntity(
    string? Name,
    string? Description
);
