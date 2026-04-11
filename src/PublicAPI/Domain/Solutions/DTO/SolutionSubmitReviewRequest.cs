namespace Domain.Solutions.DTO;

public record SolutionSubmitReviewRequest(
    string Review,
    SolutionSubmitReviewResultState ResultState
);

public enum SolutionSubmitReviewResultState
{
    Done,
    Rejected
}