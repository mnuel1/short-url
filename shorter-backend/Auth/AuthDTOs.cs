using System.ComponentModel.DataAnnotations;

namespace shorter_backend.Auth;

public record RegisterRequest
{
    [Required] public string Name     { get; init; } = string.Empty;
    [Required, EmailAddress] public string Email    { get; init; } = string.Empty;
    [Required, MinLength(8)] public string Password { get; init; } = string.Empty;
}

public record LoginRequest
{
    [Required, EmailAddress] public string Email    { get; init; } = string.Empty;
    [Required] public string Password { get; init; } = string.Empty;
}

public record GoogleSignInRequest
{
    [Required] public string IdToken { get; init; } = string.Empty;
}

public record AuthResponse
{
    public string  AccessToken { get; init; } = string.Empty;
    public DateTime ExpiresAt  { get; init; }
    public UserDto User        { get; init; } = default!;
}

public record UserDto
{
    public Guid    Id         { get; init; }
    public string  Name       { get; init; } = string.Empty;
    public string  Email      { get; init; } = string.Empty;
    public string? AvatarUrl  { get; init; }
    public string  Plan       { get; init; } = "free";
    public bool    IsVerified { get; init; }
}