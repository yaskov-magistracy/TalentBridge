using Domain.Assignments.DTO;

namespace Domain.Assignments;

public interface IAssignmentsRepository
{
    Task<Assignment?> Get(Guid id);
    Task<(Assignment task, Guid employerId)?> GetWithOwner(Guid id);
    Task<AssignmentFullInfo?> GetFull(Guid id);
    Task<AssignmentSearchResponse> Search(AssignmentSearchRequest request);
    Task<AssignmentFullInfo> Add(AssignmentCreateEntity createEntity);
    Task<AssignmentFullInfo> Update(Guid id, AssignmentUpdateEntity updateEntity);
}