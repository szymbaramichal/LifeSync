using System.Reflection;
using API.Data;
using API.Messaging;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace API.Extensions;

public static class ProgramExtensions
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

    public static void AddFluentValidators(this IServiceCollection services,
        params Assembly[] assemblies)
    {
        services.AddValidatorsFromAssembly(typeof(ProgramExtensions).Assembly);
    }

    public static void RegisterAuthentication(this IServiceCollection services,
        IConfiguration configuration)
    {
        var firebase = configuration.GetSection("Firebase");
        var projectId = firebase["ProjectId"];
        var authority = firebase["Authority"];
        var audience = firebase["Audience"];

        services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.Authority = authority;
                options.Audience = audience;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = authority,
                    ValidateAudience = true,
                    ValidAudience = audience,
                    ValidateLifetime = true
                };
            });

        services.AddAuthorization();
    }

    public static void AddCors(this IServiceCollection services,
        IConfiguration configuration)
    {
        var allowedOrigins = configuration.GetSection("AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();

        services.AddCors(options =>
        {
            options.AddDefaultPolicy(builder =>
            {
                builder.WithOrigins(allowedOrigins)
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
        });
    }

    public static void AddDatabase(this IServiceCollection services,
        IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DbConnection")
                               ?? throw new InvalidOperationException("Database connection string was not found.");

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

        if (app.Environment.IsDevelopment())
        {
            dbContext.Database.EnsureDeleted();
            dbContext.Database.Migrate();
        }
        else
        {
            var pendingMigrations = dbContext.Database.GetPendingMigrations().ToList();
            if (pendingMigrations.Count == 0)
            {
                logger.LogInformation("No pending database migrations.");
                return;
            }
            dbContext.Database.Migrate();
            logger.LogInformation("Applying {Count} pending database migration(s).", pendingMigrations.Count);

        }

        logger.LogInformation("Database migrations applied successfully.");
    }
}
