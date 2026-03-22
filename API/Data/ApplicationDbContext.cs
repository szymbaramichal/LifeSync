using API.Data.Models;
using API.Extensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> contextOptions,
    IHttpContextAccessor httpContextAccessor) : DbContext(contextOptions)
{
    public DbSet<Expense> Expenses { get; set; }
    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasIndex(u => u.FirebaseUID)
            .IsUnique();
        
        base.OnModelCreating(modelBuilder);
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = new())
    {
        var entries = ChangeTracker.Entries()
            .Where(e => e.State is EntityState.Added or EntityState.Modified);

        var textUserId = httpContextAccessor.HttpContext?.User.GetAppId();
        Guid userId = Guid.TryParse(textUserId, out var parsedUserId) ? parsedUserId : Guid.Empty;
        
        var utcNow = DateTime.UtcNow;
        foreach (var entry in entries)
        {
            var entity = entry.Entity as Shared.BaseEntity;
            if (entity is null) continue;

            if (entry.State == EntityState.Added)
            {
                entity.CreatedAtUtc = utcNow;
                entity.CreatedBy = userId;
            }

            if (entry.State == EntityState.Modified)
            {
                entity.UpdatedAtUtc = utcNow;
                entity.ModifiedBy = userId;
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }
}