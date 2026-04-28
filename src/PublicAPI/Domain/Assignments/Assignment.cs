using Domain.Employers;
using Domain.Technologies;

namespace Domain.Assignments;

public record Assignment(
    Guid Id,
    string Name,
    string Description,
    string? TemplateUrl,
    DateOnly DeadLine,
    int CandidatesCapacity,
    AssignmentDifficulty Difficulty,
    float[] AttemptsCoefficients,
    int MaxAttemptNumberToGrantMedal)
{
    public bool IsGrouped => CandidatesCapacity > 1;

    internal float GetDifficultyCoefficient() => Difficulty switch
    {
        AssignmentDifficulty.Normal => 1f,
        AssignmentDifficulty.Advanced => 1.5f,
        AssignmentDifficulty.Hard => 2f,
        _ => throw new ArgumentException()
    };
}

public record AssignmentFullInfo(
    Guid Id,
    string Name,
    string Description,
    string? TemplateUrl,
    DateOnly DeadLine,
    int CandidatesCapacity,
    AssignmentDifficulty Difficulty,
    float[] AttemptsCoefficients,
    int MaxAttemptNumberToGrantMedal,
    Employer Employer,
    Technology[]? Technologies
) : Assignment(Id, Name, Description, TemplateUrl, DeadLine, CandidatesCapacity, Difficulty, AttemptsCoefficients, MaxAttemptNumberToGrantMedal);

public enum AssignmentDifficulty
{
    Normal,
    Advanced,
    Hard
}