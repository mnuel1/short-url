using Google.Apis.Auth;
using shorter_backend.Models;
using shorter_backend.Exceptions;
using shorter_backend.Auth;

namespace shorter_backend.Auth;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task<AuthResponse> GoogleSignInAsync(GoogleSignInRequest request);
}

public class AuthService : IAuthService
{
    private readonly IUserRepository _users;
    private readonly ITokenService   _tokenService;
    private readonly IConfiguration  _config;

    public AuthService(IUserRepository users, ITokenService tokenService, IConfiguration config)
    {
        _users        = users;
        _tokenService = tokenService;
        _config       = config;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        if (await _users.EmailExistsAsync(request.Email))
            throw new ConflictException($"Email '{request.Email}' is already registered.");

        var user = new AppUser
        {
            Id           = Guid.NewGuid(),
            Name         = request.Name,
            Email        = request.Email.ToLower(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Plan         = "free",
            IsVerified   = false,
            CreatedAt    = DateTimeOffset.UtcNow,
            UpdatedAt    = DateTimeOffset.UtcNow
        };

        await _users.CreateAsync(user);
        return BuildAuthResponse(user);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await _users.GetByEmailAsync(request.Email)
            ?? throw new BadRequestException("Invalid email or password.");

        if (string.IsNullOrEmpty(user.PasswordHash))
            throw new BadRequestException("This account uses Google Sign-In.");

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            throw new BadRequestException("Invalid email or password.");

        
        return BuildAuthResponse(user);
    }

    public async Task<AuthResponse> GoogleSignInAsync(GoogleSignInRequest request)
    {
        GoogleJsonWebSignature.Payload payload;
        try
        {
            payload = await GoogleJsonWebSignature.ValidateAsync(request.IdToken,
                new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = [_config["Google:ClientId"]]
                });
        }
        catch
        {
            throw new BadRequestException("Invalid Google token.");
        }

        var user = await _users.GetByGoogleIdAsync(payload.Subject);

        if (user is null)
        {
            user = await _users.GetByEmailAsync(payload.Email);
            if (user is not null)
            {
                user.GoogleId = payload.Subject;
                await _users.UpdateAsync(user);
            }
            else
            {
                user = new AppUser
                {
                    Id         = Guid.NewGuid(),
                    Name       = payload.Name       ?? string.Empty,
                    Email      = payload.Email.ToLower(),
                    AvatarUrl  = payload.Picture,
                    GoogleId   = payload.Subject,
                    Plan       = "free",
                    IsVerified = true,
                    CreatedAt  = DateTimeOffset.UtcNow,
                    UpdatedAt  = DateTimeOffset.UtcNow
                };
                await _users.CreateAsync(user);
            }
        }

        return BuildAuthResponse(user);
    }

    private AuthResponse BuildAuthResponse(AppUser user)
    {
        var expiry = int.Parse(_config["Jwt:AccessTokenExpiryMinutes"] ?? "60");
        return new AuthResponse
        {
            AccessToken = _tokenService.GenerateAccessToken(user),
            ExpiresAt   = DateTime.UtcNow.AddMinutes(expiry),
            User        = new UserDto
            {
                Id         = user.Id,
                Name       = user.Name,
                Email      = user.Email,
                AvatarUrl  = user.AvatarUrl,
                Plan       = user.Plan,
                IsVerified = user.IsVerified
            }
        };
    }
}