using Domain.Technologies.DTO;

namespace API.Technologies.DTO;

public record TechnologyAddBatchApiRequest(TechnologyCreateEntity[] ToAdd)
{
    
}