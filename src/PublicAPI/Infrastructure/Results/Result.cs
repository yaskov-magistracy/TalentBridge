using System.Net;
using Microsoft.AspNetCore.Mvc;

namespace Infrastructure.Results;

public record class Result<T>(
    HttpStatusCode StatusCode,
    string? Error,
    T Value = default)
    : EmptyResult(StatusCode, Error)
{
    public override ActionResult ActionResult =>
        StatusCode switch
        {
            HttpStatusCode.OK => new OkObjectResult(Value),
            _ => base.ActionResult
        };
}


public static class Results
{
    public static Result<T> Ok<T>(T value)
        => new Result<T>(HttpStatusCode.OK, null, value);

    public static Result<T> NoContent<T>()
        => new Result<T>(HttpStatusCode.NoContent, null);

    public static Result<T> BadRequest<T>(string error)
        => new Result<T>(HttpStatusCode.BadRequest, error);

    public static Result<T> NotFound<T>(string error)
        => new Result<T>(HttpStatusCode.NotFound, error);
    
    public static Result<T2> From<T1, T2>(Result<T1> source) => new(source.StatusCode, source.Error);
}