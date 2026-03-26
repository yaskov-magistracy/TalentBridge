namespace API.Solutions.DTO;

public record SolutionPatchApiRequest(
    string? SolutionUrl = null,
    SolutionTeamPatchApiRequest? Team = null
);

public record SolutionTeamPatchApiRequest(
    string? Name,
    string? Description
);