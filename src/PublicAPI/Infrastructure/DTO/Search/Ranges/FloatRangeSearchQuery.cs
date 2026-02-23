namespace Infrastructure.DTO.Search.Ranges;

public class FloatRangeSearchQuery : RangeSearchQuery<float>
{
    public FloatRangeSearchQuery(float? from, float? to)
        : base(from ?? float.MinValue, to ?? float.MaxValue)
    {
    }
}