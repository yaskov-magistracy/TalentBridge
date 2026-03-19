using Domain.Solutions.DTO;

namespace Domain.Solutions;

public interface ISolutionsRepository
{
    Task<SolutionShortInfo?> Get(Guid id);
    Task<SolutionFullInfo?> GetFull(Guid id);
    Task<SolutionSearchResponse> Search(SolutionSearchRequest request);
    Task<SolutionFullInfo> Add(SolutionCreateEntity createEntity);
    Task<SolutionFullInfo> Update(Guid id, SolutionPatchEntity patchEntity);
}
