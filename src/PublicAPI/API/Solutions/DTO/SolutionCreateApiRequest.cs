namespace API.Solutions.DTO;

public record SolutionCreateApiRequest(
    Guid AssignmentId,
    SolutionTeamCreateApiRequest? Team = null
);

public record SolutionTeamCreateApiRequest(
    string Name,
    string Description
);