namespace shorter_backend.Models;

public class AppUser
{
    public Guid     Id           { get; set; }
    public string   Email        { get; set; } = string.Empty;
    public string   Name         { get; set; } = string.Empty;
    public string?  AvatarUrl    { get; set; }
    public string?  PasswordHash { get; set; }
    public string   Plan         { get; set; } = "free";
    public bool     IsVerified   { get; set; } = false;
    public string?  GoogleId     { get; set; }
    public DateTimeOffset CreatedAt  { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAt  { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? DeletedAt { get; set; }
}