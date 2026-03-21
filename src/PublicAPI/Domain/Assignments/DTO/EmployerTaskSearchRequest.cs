using Infrastructure.DTO.Search;

namespace Domain.Assignments.DTO;

public record AssignmentSearchRequest(
    Guid? EmployerId = null,
    string? Text = null,
    int Take = 100,
    int Skip = 0
) : BaseSearchRequest<Assignment>(Take, Skip)
{
    
}