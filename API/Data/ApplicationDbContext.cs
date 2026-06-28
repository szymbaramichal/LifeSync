using API.Data.Models;
using API.Shared;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> contextOptions,
    IHttpContextAccessor httpContextAccessor) : DbContext(contextOptions)
{
    public DbSet<Expense> Expenses { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<ExpenseGroup> ExpenseGroups { get; set; }
    public DbSet<UserExpenseGroup> UserExpenseGroups { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = new())
    {
        var entries = ChangeTracker.Entries()
            .Where(e => e.State is EntityState.Added or EntityState.Modified);

        var textUserId = httpContextAccessor.HttpContext?.User.FindFirst(AuthConstants.FirebaseUidClaimType)?.Value;;
        Guid userId = Guid.TryParse(textUserId, out var parsedUserId) ? parsedUserId : Guid.Empty;

        var utcNow = DateTime.UtcNow;
        foreach (var entry in entries)
        {
            if (entry.Entity is not BaseEntity entity) continue;

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
