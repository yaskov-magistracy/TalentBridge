using Infrastructure.DTO.Search;

namespace Domain.Technologies.DTO;

public record TechnologySearchRequest(
    string? Name = null,
    int Take = 100,
    int Skip = 0
) : BaseSearchRequest(Take, Skip);