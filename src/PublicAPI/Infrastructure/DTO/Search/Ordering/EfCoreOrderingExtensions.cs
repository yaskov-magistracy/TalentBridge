using System.Linq.Expressions;

namespace Infrastructure.DTO.Search.Ordering;

public static class EfCoreOrderingExtensions
{
    public static IOrderedQueryable<T> OrderByDirection<T, TKey>(
        this IQueryable<T> source, 
        Expression<Func<T, TKey>> keySelector, 
        SearchOrderingDirection direction)
    {
        return direction == SearchOrderingDirection.Ascending
            ? source.OrderBy(keySelector)
            : source.OrderByDescending(keySelector);
    }
}