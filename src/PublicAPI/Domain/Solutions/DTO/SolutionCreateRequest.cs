namespace Domain.Solutions.DTO;

public record SolutionCreateRequest(
    Guid AssignmentId,
    Guid CandidateOwnerId,
    TeamCreateRequest? Team
);

public record TeamCreateRequest(
    string Name,
    string Description
);