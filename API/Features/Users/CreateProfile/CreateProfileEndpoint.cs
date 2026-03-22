using API.Data;
using API.Extensions;
using API.Messaging;
using API.Shared;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace API.Features.Users.CreateProfile;

public sealed record CreateProfileRequest(string DisplayName);

public static class CreateProfileEndpoint
{
    public static RouteGroupBuilder MapCreateProfileEndpoint(this RouteGroupBuilder group)
    {
        group.MapPost("/profile", HandleAsync)
            .WithName("CreateProfile")
            .WithSummary("Create current user profile")
            .WithDescription("Creates a profile for the authenticated Firebase user.")
            .Produces<CreateProfileResult>(StatusCodes.Status201Created)
            .Produces(StatusCodes.Status401Unauthorized)
            .Produces(StatusCodes.Status409Conflict)
            .RequireAuthorization(AuthConstants.AuthenticatedOnlyPolicy);

        return group;
    }

    private static async Task<IResult> HandleAsync(
        CreateProfileRequest request,
        HttpContext httpContext,
        IMediator sender,
        IValidator<CreateProfileRequest> validator,
        CancellationToken cancellationToken)
    {
        var validationResult = await validator.ValidateAsync(request, cancellationToken);
        
        if (!validationResult.IsValid)
        {            
            return TypedResults.UnprocessableEntity(validationResult);
        }
        
        var firebaseUid = httpContext.User.GetFirebaseUid();
        
        var result = await sender.Send(
            new CreateProfileCommand(firebaseUid!, request.DisplayName),
            cancellationToken);

        if (result is null)
        {
            return TypedResults.Conflict();
        }

        return TypedResults.Created("/api/users/me", result);
    }
}

public class CreateProfileRequestValidator : AbstractValidator<CreateProfileRequest>
{
    public CreateProfileRequestValidator(ApplicationDbContext dbContext)
    {
        RuleFor(x => x.DisplayName)
            .NotEmpty().WithMessage("Display name is required.")
            .MustAsync(async (displayName, cancellationToken) =>
            {
                var normalized = displayName.Trim();

                return !await dbContext.Users
                    .AnyAsync(u => u.DisplayName == normalized, cancellationToken);
            })
            .WithMessage("Display name is already taken.");
    }
}