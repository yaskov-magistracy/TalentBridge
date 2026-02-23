namespace Infrastructure.DTO.Search.Ranges;

public class IntRangeSearchQuery : RangeSearchQuery<int>
{
    public IntRangeSearchQuery(int? from, int? to) 
        : base(from ?? int.MinValue, to ?? int.MaxValue)
    {
    }
}