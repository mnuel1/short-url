using Microsoft.EntityFrameworkCore;
using shorter_backend.Data;
using shorter_backend.Models;

namespace shorter_backend.Auth;

public interface IUserRepository
{
    Task<AppUser?> GetByIdAsync(Guid id);
    Task<AppUser?> GetByEmailAsync(string email);
    Task<AppUser?> GetByGoogleIdAsync(string googleId);
    Task<bool> EmailExistsAsync(string email);
    Task<AppUser> CreateAsync(AppUser user);
    Task<AppUser> UpdateAsync(AppUser user);
}

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _db;
    public UserRepository(AppDbContext db) => _db = db;

    public async Task<AppUser?> GetByIdAsync(Guid id)
        => await _db.Users.FirstOrDefaultAsync(u => u.Id == id);

    public async Task<AppUser?> GetByEmailAsync(string email)
        => await _db.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());

    public async Task<AppUser?> GetByGoogleIdAsync(string googleId)
        => await _db.Users.FirstOrDefaultAsync(u => u.GoogleId == googleId);

    public async Task<bool> EmailExistsAsync(string email)
        => await _db.Users.AnyAsync(u => u.Email.ToLower() == email.ToLower());

    public async Task<AppUser> CreateAsync(AppUser user)
    {
        _db.Users.Add(user);
        await _db.SaveChangesAsync();
        return user;
    }

    public async Task<AppUser> UpdateAsync(AppUser user)
    {
        user.UpdatedAt = DateTimeOffset.UtcNow;
        _db.Users.Update(user);
        await _db.SaveChangesAsync();
        return user;
    }
}