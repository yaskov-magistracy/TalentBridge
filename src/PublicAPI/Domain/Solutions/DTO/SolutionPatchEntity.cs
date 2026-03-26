using Infrastructure.DTO;

namespace Domain.Solutions.DTO;

public record SolutionPatchEntity(
    string? SolutionUrl = null,
    SolutionState? State = null,
    SolutionTeamPatchEntity? Team = null,
    RelationsPatch? Candidates = null
);

public record SolutionTeamPatchEntity(
    string? Name,
    string? Description
);
