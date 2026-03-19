namespace Domain.Solutions.DTO;

public record SolutionCreateRequest(
    Guid EmployerTaskId,
    Guid CandidateId)
{
    
}