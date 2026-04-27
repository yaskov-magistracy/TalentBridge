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
    float[] AttemptsCoefficients)
{
    public bool IsGrouped => CandidatesCapacity > 1;
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
    Employer Employer,
    Technology[]? Technologies
) : Assignment(Id, Name, Description, TemplateUrl, DeadLine, CandidatesCapacity, Difficulty, AttemptsCoefficients);

public enum AssignmentDifficulty
{
    Normal,
    Advanced,
    Hard
}