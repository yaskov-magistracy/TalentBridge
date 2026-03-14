using Infrastructure.DTO.Search;

namespace Domain.EmployerTasks.DTO;

public record EmployerTaskSearchRequest(
    Guid? EmployerId = null,
    string? Text = null,
    int Take = 100,
    int Skip = 0
) : BaseSearchRequest<EmployerTask>(Take, Skip)
{
    
}