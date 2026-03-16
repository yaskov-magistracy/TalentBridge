using Infrastructure.DTO.Search;

namespace Domain.EmployerTasks.DTO;

public record EmployerTaskSearchResponse(
    ICollection<EmployerTaskFullInfo> Items, 
    int TotalCount
) : BaseSearchResponse<EmployerTaskFullInfo>(Items, TotalCount)
{
    
}