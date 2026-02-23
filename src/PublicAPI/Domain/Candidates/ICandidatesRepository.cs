using Domain.Candidates.DTO;

namespace Domain.Candidates;

public interface ICandidatesRepository
{
    public Task<Candidate?> Get(Guid id);
    public Task<Candidate?> Get(string login);
    public Task<Candidate> Add(CandidateCreateEntity createEntity);
    public Task<Candidate> Update(Guid id, CandidateUpdateEntity updateEntity);
}