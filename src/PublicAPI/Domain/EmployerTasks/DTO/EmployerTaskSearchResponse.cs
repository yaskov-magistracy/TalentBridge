using Infrastructure.DTO.Search;

namespace Domain.EmployerTasks.DTO;

public record EmployerTaskSearchResponse(
    ICollection<EmployerTask> Items, 
    int TotalCount
) : BaseSearchResponse<EmployerTask>(Items, TotalCount)
{
    
}