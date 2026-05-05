namespace Domain.Assignments.DTO;

public record AssignmentQuotaResponse(
    int MedalsToGrantLeft,
    int MedalsToGrantLimit
)
{
    
}