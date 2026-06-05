using API.Extensions;
using API.Messaging.Mediator;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.ExpenseGroups.RemoveUserFromExpenseGroup;

public static class RemoveUserFromExpenseGroupEndpoint
{
    public static RouteGroupBuilder MapRemoveUserFromExpenseGroupEndpoint(this RouteGroupBuilder group)
    {
        group.MapDelete("/{groupId:guid}/members/{memberUserId:guid}", HandleAsync)
            .WithName("RemoveUserFromExpenseGroup")
            .WithSummary("Remove user from expense group")
            .WithDescription("Removes a user from an expense group if the current user is the group owner.")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status401Unauthorized)
            .Produces(StatusCodes.Status404NotFound);

        return group;
    }

    private static async Task<IResult> HandleAsync(
        [FromRoute] Guid groupId,
        [FromRoute] Guid memberUserId,
        HttpContext context,
        IMediator sender,
        CancellationToken cancellationToken)
    {
        var requesterUserId = context.User.GetUserId();

        var removed = await sender.Send(
            new RemoveUserFromExpenseGroupCommand(requesterUserId, groupId, memberUserId),
            cancellationToken);

        return removed ? TypedResults.NoContent() : TypedResults.NotFound();
    }
}
