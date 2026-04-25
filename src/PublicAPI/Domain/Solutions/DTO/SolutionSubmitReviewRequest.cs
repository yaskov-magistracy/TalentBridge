namespace Domain.Solutions.DTO;

public record SolutionSubmitReviewRequest(
    string Comment,
    int Score,
    SolutionSubmitReviewResultState ResultState
);

public enum SolutionSubmitReviewResultState
{
    Done,
    Failed
}