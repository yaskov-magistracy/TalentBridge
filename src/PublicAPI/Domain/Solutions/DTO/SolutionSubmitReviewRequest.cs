namespace Domain.Solutions.DTO;

public record SolutionSubmitReviewRequest(
    string Comment,
    int Score,
    SolutionSubmitReviewResultState ResultState,
    bool GrantMedal
);

public enum SolutionSubmitReviewResultState
{
    Done,
    Failed
}