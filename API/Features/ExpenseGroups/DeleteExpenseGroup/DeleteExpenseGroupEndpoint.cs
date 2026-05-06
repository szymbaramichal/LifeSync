using API.Extensions;
using API.Messaging;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.ExpenseGroups.DeleteExpenseGroup;

public static class DeleteExpenseGroupEndpoint
{
    public static RouteGroupBuilder MapDeleteExpenseGroupEndpoint(this RouteGroupBuilder group)
    {
        group.MapDelete("/{groupId:guid}", HandleAsync)
            .WithName("DeleteExpenseGroup")
            .WithSummary("Delete an expense group")
            .WithDescription("Deletes an expense group if the current user is its owner.")
            .Produces(StatusCodes.Status204NoContent)
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
        
        var deleted = await sender.Send(new DeleteExpenseGroupCommand(userId, groupId), cancellationToken);

        return deleted ? TypedResults.NoContent() : TypedResults.NotFound();
    }
}

