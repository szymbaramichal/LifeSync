using API.Extensions;
using API.Messaging;

namespace API.Features.ExpenseGroups.GetExpenseGroups;

public static class GetExpenseGroupsEndpoint
{
    public static RouteGroupBuilder MapGetExpenseGroupsEndpoint(this RouteGroupBuilder group)
    {
        group.MapGet("/", HandleAsync)
            .WithName("GetExpenseGroups")
            .WithSummary("Get current user expense groups")
            .WithDescription("Returns expense groups assigned to the authenticated user.")
            .Produces<List<GetExpenseGroupsResult>>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status401Unauthorized);

        return group;
    }

    private static async Task<IResult> HandleAsync(
        HttpContext httpContext,
        IMediator sender,
        CancellationToken cancellationToken)
    {
        var userId = httpContext.User.GetUserId();

        var response = await sender.Send(new GetExpenseGroupsQuery(userId), cancellationToken);

        return TypedResults.Ok(response);
    }
}

