using API.Extensions;
using API.Messaging;

namespace API.Features.Users.CreateProfile;

public static class CreateProfileEndpoint
{
    private sealed record CreateProfileRequest(string DisplayName);

    public static RouteGroupBuilder MapCreateProfileEndpoint(this RouteGroupBuilder group)
    {
        group.MapPost("/profile", HandleAsync)
            .WithName("CreateProfile")
            .WithSummary("Create current user profile")
            .WithDescription("Creates a profile for the authenticated Firebase user.")
            .Produces<CreateProfileResult>(StatusCodes.Status201Created)
            .Produces(StatusCodes.Status401Unauthorized)
            .Produces(StatusCodes.Status409Conflict);

        return group;
    }

    private static async Task<IResult> HandleAsync(
        CreateProfileRequest request,
        HttpContext httpContext,
        IMediator sender,
        CancellationToken cancellationToken)
    {
        var firebaseUid = httpContext.User.GetFirebaseUid();
        if (string.IsNullOrWhiteSpace(firebaseUid))
        {
            return TypedResults.Unauthorized();
        }

        var result = await sender.Send(
            new CreateProfileCommand(firebaseUid, request.DisplayName),
            cancellationToken);

        if (result is null)
        {
            return TypedResults.Conflict();
        }

        return TypedResults.Created("/api/users/me", result);
    }
}

