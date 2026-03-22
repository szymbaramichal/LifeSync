using System.Reflection;
using System.Security.Claims;
using API.Data;
using API.Shared;
using API.Messaging;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
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
                
                options.Events = new JwtBearerEvents
                {
                    OnTokenValidated = async context =>
                    {
                        var principal = context.Principal;
                        var firebaseUid = principal?.GetFirebaseUid();

                        if (string.IsNullOrWhiteSpace(firebaseUid))
                        {
                            context.Fail("Invalid token: Missing user_id claim.");
                            return;
                        }

                        var dbContext = context.HttpContext.RequestServices.GetRequiredService<ApplicationDbContext>();
                        var user = await dbContext.Users
                            .AsNoTracking()
                            .SingleOrDefaultAsync(u => u.FirebaseUID == firebaseUid, context.HttpContext.RequestAborted);

                        // Valid Firebase token without local profile is allowed (e.g. profile creation flow).
                        if (user is null)
                        {
                            return;
                        }

                        if (principal?.Identity is not ClaimsIdentity identity)
                        {
                            context.Fail("Invalid token principal identity.");
                            return;
                        }

                        if (!identity.HasClaim(c => c.Type == AuthConstants.UserIdClaimType))
                        {
                            identity.AddClaim(new Claim(AuthConstants.UserIdClaimType, user.Id.ToString()));
                        }
                    }
                };
                
            });

        services.AddAuthorization(options =>
        {
            options.DefaultPolicy = new AuthorizationPolicyBuilder()
                .RequireAuthenticatedUser()
                .RequireClaim(AuthConstants.UserIdClaimType)
                .Build();

            options.AddPolicy(AuthConstants.AuthenticatedOnlyPolicy, policy =>
                policy.RequireAuthenticatedUser());
        });
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
