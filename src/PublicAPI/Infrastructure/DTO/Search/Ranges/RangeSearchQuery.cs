namespace Infrastructure.DTO.Search.Ranges;

public class RangeSearchQuery<T>
{
    public T From { get; }
    public T To { get; }

    public RangeSearchQuery(T from, T to)
    {
        From = from;
        To = to;
    }
}