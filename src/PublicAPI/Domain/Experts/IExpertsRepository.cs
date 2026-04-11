using Domain.Experts.DTO;

namespace Domain.Experts;

public interface IExpertsRepository
{
    public Task<Expert?> Get(Guid id);
    public Task<ExpertFullInfo?> GetFull(Guid id);
    public Task<Expert?> Get(string login);
    public Task<Expert> Add(ExpertCreateEntity createEntity);
    public Task<Expert> Update(Guid id, ExpertUpdateEntity updateEntity);
}