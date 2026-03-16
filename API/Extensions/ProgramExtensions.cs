using System.Reflection;
using API.Data;
using API.Messaging;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions;

public static class DependencyInjection
{
    public static void AddCustomMediator(this IServiceCollection services,
        params Assembly[] assemblies)
    {
        services.AddScoped<IMediator, Mediator>();

        services.Scan(scan => scan
            .FromAssemblies(assemblies)
            .AddClasses(c => c.AssignableTo(typeof(IRequestHandler<,>)))
            .AsImplementedInterfaces()
            .WithScopedLifetime());
    }

    public static void AddDatabase(this IServiceCollection services,
        string connectionString)
    {
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlite(connectionString));
    }
}

public static class ApplicationStartupExtensions
{
    public static void ApplyDatabaseMigrations(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var logger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>()
            .CreateLogger("Startup.Migrations");
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        var pendingMigrations = dbContext.Database.GetPendingMigrations().ToList();
        if (pendingMigrations.Count == 0)
        {
            logger.LogInformation("No pending database migrations.");
            return;
        }

        logger.LogInformation("Applying {Count} pending database migration(s).", pendingMigrations.Count);
        dbContext.Database.Migrate();
        logger.LogInformation("Database migrations applied successfully.");
    }
}
