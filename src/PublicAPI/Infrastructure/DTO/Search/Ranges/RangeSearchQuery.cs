namespace Infrastructure.DTO.Search.Ranges;

public record RangeSearchQuery<T>
{
    public T From { get; }
    public T To { get; }

    public RangeSearchQuery(T from, T to)
    {
        From = from;
        To = to;
    }
}