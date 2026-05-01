using Domain.Candidates.DTO;

namespace Domain.Candidates;

public interface ICandidatesRepository
{
    public Task<Candidate?> Get(Guid id);
    public Task<CandidateFullInfo?> GetFull(Guid id);
    public Task<Candidate?> Get(string login);
    public Task<CandidateFullInfo?> GetFull(string login);
    public Task<CandidateSearchResponse> Search(CandidateSearchRequest request);
    public Task<Guid> Create(CandidateCreateEntity createEntity);
    public Task Patch(Guid id, CandidatePatchEntity patchEntity);
}