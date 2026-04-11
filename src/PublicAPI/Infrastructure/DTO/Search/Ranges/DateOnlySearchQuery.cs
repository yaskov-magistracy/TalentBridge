namespace Infrastructure.DTO.Search.Ranges;

public record DateOnlySearchQuery
{
    public DateOnly From { get; set; } = DateOnly.FromDateTime(DateTime.MinValue);

    public DateOnly To { get; set; } = DateOnly.FromDateTime(DateTime.MaxValue);
}
    