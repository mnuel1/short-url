namespace shorter_backend.Exceptions;

public abstract class AppException : Exception
{
    protected AppException(string message) : base(message) { }
}

public class NotFoundException : AppException
{
    public NotFoundException(string name, object key)
        : base($"'{name}' with key '{key}' was not found.") { }
}

public class BadRequestException : AppException
{
    public BadRequestException(string message) : base(message) { }
}

public class ConflictException : AppException
{
    public ConflictException(string message) : base(message) { }
}

public class UnauthorizedException : AppException
{
    public UnauthorizedException(string message = "Unauthorized.")
        : base(message) { }
}