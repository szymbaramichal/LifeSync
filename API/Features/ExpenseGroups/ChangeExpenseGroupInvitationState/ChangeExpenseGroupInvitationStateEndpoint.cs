using API.Extensions;
using API.Messaging.Mediator;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.ExpenseGroups.ChangeExpenseGroupInvitationState;

public static class ChangeExpenseGroupInvitationStateEndpoint
{
    public static RouteGroupBuilder MapChangeExpenseGroupInvitationStateEndpoint(this RouteGroupBuilder group)
    {
        group.MapPut("/{groupId:guid}/{action}", HandleAsync)
            .WithName("ChangeExpenseGroupInvitationState")
            .WithSummary("Accept/decline group invitation")
            .WithDescription("Accepts or decline existing user for pending invitations.")
            .Produces(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status401Unauthorized)
            .Produces(StatusCodes.Status404NotFound);

        return group;
    }

    private static async Task<IResult> HandleAsync(
        [FromRoute] Guid groupId,
        [FromRoute] string action,
        HttpContext context,
        IMediator sender,
        CancellationToken cancellationToken)
    {
        var requesterUserId = context.User.GetUserId();

        var success = await sender.Send(
            new ChangeExpenseGroupInvitationStateCommand(requesterUserId, groupId, action),
            cancellationToken);

        return success ? TypedResults.Ok() : TypedResults.NotFound();
    }
}
