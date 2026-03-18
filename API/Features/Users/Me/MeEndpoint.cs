using API.Extensions;
using API.Messaging;

namespace API.Features.Users.Me;

public static class MeEndpoint
{
    public static RouteGroupBuilder MapMeEndpoint(this RouteGroupBuilder group)
    {
        group.MapGet("/me", HandleAsync)
            .WithName("GetMe")
            .WithSummary("Get current user profile")
            .WithDescription("Returns the profile of the authenticated Firebase user.")
            .Produces<MeResult>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status401Unauthorized)
            .Produces(StatusCodes.Status404NotFound);

        return group;
    }

    private static async Task<IResult> HandleAsync(
        HttpContext httpContext,
        IMediator sender,
        CancellationToken cancellationToken)
    {
        var firebaseUid = httpContext.User.GetFirebaseUid();
        if (string.IsNullOrWhiteSpace(firebaseUid))
        {
            return TypedResults.Unauthorized();
        }

        var result = await sender.Send(new MeQuery(firebaseUid), cancellationToken);

        if (result is null)
        {
            return TypedResults.Forbid();
        }

        return TypedResults.Ok(result);
    }
}

