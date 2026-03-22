using System.Net;
using System.Text.Json;
using shorter_backend.Exceptions;

namespace shorter_backend.Auth.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next,
        ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next   = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var (statusCode, message) = exception switch
        {
            NotFoundException     ex => (HttpStatusCode.NotFound,            ex.Message),
            BadRequestException   ex => (HttpStatusCode.BadRequest,          ex.Message),
            ConflictException     ex => (HttpStatusCode.Conflict,            ex.Message),
            UnauthorizedException ex => (HttpStatusCode.Unauthorized,        ex.Message),
            _                       => (HttpStatusCode.InternalServerError,  "An unexpected error occurred.")
        };

        if (statusCode == HttpStatusCode.InternalServerError)
            _logger.LogError(exception, "Unhandled exception: {Message}", exception.Message);
        else
            _logger.LogWarning("Handled exception [{Code}]: {Message}", (int)statusCode, exception.Message);

        context.Response.ContentType = "application/json";
        context.Response.StatusCode  = (int)statusCode;

        await context.Response.WriteAsync(JsonSerializer.Serialize(new
        {
            status  = (int)statusCode,
            error   = message,
            traceId = context.TraceIdentifier
        },
        new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }));
    }
}