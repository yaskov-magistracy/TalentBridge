namespace Domain.Solutions.DTO;

public record SolutionCreateRequest(
    Guid AssignmentId,
    Guid CandidateId)
{
    
}