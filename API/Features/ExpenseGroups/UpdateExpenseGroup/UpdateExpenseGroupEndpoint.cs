using API.Extensions;
using API.Messaging;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.ExpenseGroups.UpdateExpenseGroup;

public sealed record UpdateExpenseGroupRequest(string Name, bool IsPrivate);

public static class UpdateExpenseGroupEndpoint
{
    public static RouteGroupBuilder MapUpdateExpenseGroupEndpoint(this RouteGroupBuilder group)
    {
        group.MapPatch("/{groupId:guid}", HandleAsync)
            .WithName("UpdateExpenseGroup")
            .WithSummary("Update an expense group")
            .WithDescription("Updates an expense group if the current user is its owner.")
            .Produces<UpdateExpenseGroupResult>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status401Unauthorized)
            .Produces(StatusCodes.Status404NotFound);

        return group;
    }

    private static async Task<IResult> HandleAsync(
        [FromRoute] Guid groupId,
        UpdateExpenseGroupRequest request,
        HttpContext httpContext,
        IMediator sender,
        CancellationToken cancellationToken)
    {
        var userId = httpContext.User.GetUserId();

        var result = await sender.Send(
            new UpdateExpenseGroupCommand(userId, groupId, request.Name, request.IsPrivate),
            cancellationToken);

        return result is null ? TypedResults.NotFound() : TypedResults.Ok(result);
    }
}

