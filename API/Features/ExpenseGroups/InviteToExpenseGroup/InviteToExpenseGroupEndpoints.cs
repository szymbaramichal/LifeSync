using API.Extensions;
using API.Messaging.Mediator;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.ExpenseGroups.InviteToExpenseGroup;

public static class InviteToExpenseGroupEndpoints
{
    public static RouteGroupBuilder MapInviteToExpenseGroupEndpoint(this RouteGroupBuilder group)
    {
        group.MapPost("/{groupId:guid}/invite", HandleAsync)
            .WithName("InviteToExpenseGroup")
            .WithSummary("Invite user to existing expense group")
            .WithDescription("Invite existing user to existing expense group by setting his invitation status to pending");

        return group;
    }

    private static async Task<IResult> HandleAsync(
        [FromRoute] Guid groupId,
        [FromBody] InviteToExpenseGroupRequest request,
        HttpContext context,
        IMediator sender,
        CancellationToken cancellationToken)
    {
        var userId = context.User.GetUserId();

        var result = await sender.Send(new InviteToExpenseGroupCommand(userId, groupId, request.Username), cancellationToken);

        if (result == true)
        {
            return Results.Ok();
        }
        else
        {
            return Results.BadRequest($"You cannot invite {request.Username} to your group");
        }
    }
}

public sealed record InviteToExpenseGroupRequest(string Username);
