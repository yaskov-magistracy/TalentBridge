namespace Domain.Solutions.DTO;

public record SolutionPatchRequest(
    string? SolutionUrl = null,
    SolutionTeamPatchRequest? Team = null
);

public record SolutionTeamPatchRequest(
    string Name,
    string Description
);