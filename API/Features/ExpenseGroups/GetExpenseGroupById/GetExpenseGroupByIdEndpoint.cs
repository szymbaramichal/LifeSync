using API.Extensions;
using API.Messaging;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.ExpenseGroups.GetExpenseGroupById;

public static class GetExpenseGroupByIdEndpoint
{
    public static RouteGroupBuilder MapGetExpenseGroupByIdEndpoint(this RouteGroupBuilder group)
    {
        group.MapGet("/{groupId:guid}", HandleAsync)
            .WithName("GetExpenseGroupById")
            .WithSummary("Get expense group by id")
            .WithDescription("Returns a single expense group assigned to the authenticated user.")
            .Produces<GetExpenseGroupByIdResult>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status401Unauthorized)
            .Produces(StatusCodes.Status404NotFound);

        return group;
    }

    private static async Task<IResult> HandleAsync(
        [FromRoute] Guid groupId,
        HttpContext httpContext,
        IMediator sender,
        CancellationToken cancellationToken)
    {
        var userId = httpContext.User.GetUserId();

        var result = await sender.Send(new GetExpenseGroupByIdQuery(userId, groupId), cancellationToken);

        return result is null ? TypedResults.NotFound() : TypedResults.Ok(result);
    }
}

