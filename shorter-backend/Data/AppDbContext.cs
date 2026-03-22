using Microsoft.EntityFrameworkCore;
using shorter_backend.Models;

namespace shorter_backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<AppUser> Users => Set<AppUser>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<AppUser>(entity =>
        {
            entity.ToTable("users");

            entity.HasKey(u => u.Id);

            entity.Property(u => u.Id)
                  .HasColumnName("id")
                  .HasDefaultValueSql("NEWSEQUENTIALID()");

            entity.Property(u => u.Email)
                  .HasColumnName("email")
                  .HasMaxLength(320)
                  .IsRequired();

            entity.Property(u => u.Name)
                  .HasColumnName("name")
                  .HasMaxLength(255)
                  .IsRequired();

            entity.Property(u => u.AvatarUrl)
                  .HasColumnName("avatar_url")
                  .HasMaxLength(2048);

            entity.Property(u => u.PasswordHash)
                  .HasColumnName("password_hash")
                  .HasMaxLength(255);

            entity.Property(u => u.Plan)
                  .HasColumnName("plan")
                  .HasMaxLength(10)
                  .HasDefaultValue("free")
                  .IsRequired();

            entity.Property(u => u.IsVerified)
                  .HasColumnName("is_verified")
                  .HasDefaultValue(false);

            entity.Property(u => u.GoogleId)
                  .HasColumnName("google_id");

            entity.Property(u => u.CreatedAt)
                  .HasColumnName("created_at")
                  .HasDefaultValueSql("SYSDATETIMEOFFSET()");

            entity.Property(u => u.UpdatedAt)
                  .HasColumnName("updated_at")
                  .HasDefaultValueSql("SYSDATETIMEOFFSET()");

            entity.Property(u => u.DeletedAt)
                  .HasColumnName("deleted_at");

            entity.HasIndex(u => u.Email)
                  .IsUnique()
                  .HasDatabaseName("UQ_users_email");

            entity.ToTable(t => t.HasCheckConstraint("CK_users_plan", "[plan] IN ('free', 'pro')"));

            entity.HasQueryFilter(u => u.DeletedAt == null);
        });
    }
}