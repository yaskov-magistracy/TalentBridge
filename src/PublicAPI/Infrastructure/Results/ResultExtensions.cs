namespace Infrastructure.Results;

public static class ResultExtensions
{
    public static Result<TResult> Map<TSource, TResult>(this Result<TSource> result, Func<TSource, TResult> mapper)
    {
        return result.IsSuccess 
            ? Results.Ok(mapper(result.Value)) 
            : new Result<TResult>(result.StatusCode, result.Error);
    }
}