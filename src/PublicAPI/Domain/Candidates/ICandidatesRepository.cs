using Domain.Candidates.DTO;

namespace Domain.Candidates;

public interface ICandidatesRepository
{
    public Task<Candidate?> Get(Guid id);
    public Task<CandidateFullInfo?> GetFull(Guid id);
    public Task<Candidate?> Get(string login);
    public Task<CandidateFullInfo?> GetFull(string login);
    public Task<CandidateFullInfo> Add(CandidateCreateEntity createEntity);
    public Task<CandidateFullInfo> Update(Guid id, CandidateUpdateEntity updateEntity);
}