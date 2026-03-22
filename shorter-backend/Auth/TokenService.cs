using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using shorter_backend.Models;

namespace shorter_backend.Auth;

public interface ITokenService
{
    string GenerateAccessToken(AppUser user);
}

public class TokenService : ITokenService
{
    private readonly IConfiguration _config;
    public TokenService(IConfiguration config) => _config = config;

    public string GenerateAccessToken(AppUser user)
    {
        var secret  = _config["Jwt:Secret"]!;
        var issuer  = _config["Jwt:Issuer"]!;
        var audience = _config["Jwt:Audience"]!;
        var expiry  = int.Parse(_config["Jwt:AccessTokenExpiryMinutes"] ?? "60");

        var key   = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub,   user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.Jti,   Guid.NewGuid().ToString()),
            new Claim("name",                        user.Name),
            new Claim("plan",                        user.Plan),
        };

        var token = new JwtSecurityToken(
            issuer:             issuer,
            audience:           audience,
            claims:             claims,
            expires:            DateTime.UtcNow.AddMinutes(expiry),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}