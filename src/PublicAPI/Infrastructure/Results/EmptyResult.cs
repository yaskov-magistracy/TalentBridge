using System.Net;
using Microsoft.AspNetCore.Mvc;

namespace Infrastructure.Results;

public record class EmptyResult(
    HttpStatusCode StatusCode,
    string? Error)
{
    public bool IsSuccess => Error == null;
    
    public virtual ActionResult ActionResult =>
        StatusCode switch
        {
            HttpStatusCode.NoContent => new NoContentResult(),
            HttpStatusCode.BadRequest => new BadRequestObjectResult(Error),
            HttpStatusCode.NotFound => new NotFoundObjectResult(Error),
            _ => throw new ArgumentException($"Result does not support {StatusCode}")
        };
}

public static class EmptyResults
{
    public static EmptyResult NoContent()
        => new EmptyResult(HttpStatusCode.NoContent, null);

    public static EmptyResult BadRequest(string error)
        => new EmptyResult(HttpStatusCode.BadRequest, error);

    public static EmptyResult NotFound(string error)
        => new EmptyResult(HttpStatusCode.NotFound, error);
}