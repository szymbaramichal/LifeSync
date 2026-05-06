using API.Messaging;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.ExpenseGroups.Expenses.GetExpenseById;

public static class GetExpenseByIdEndpoint
{
    public static RouteGroupBuilder MapGetExpenseByIdEndpoint(this RouteGroupBuilder group)
    {
        group.MapGet("/{expenseId:guid}", HandleAsync)
            .WithName("GetExpenseById")
            .WithSummary("Get an expense by id")
            .WithDescription("Returns a single expense by its unique identifier.")
            .Produces<GetExpenseByIdResult>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound);

        return group;
    }

    private static async Task<IResult> HandleAsync(
        [FromRoute] Guid groupId,
        [FromRoute] Guid expenseId,
        IMediator sender,
        CancellationToken cancellationToken)
    {
        var result = await sender.Send(new GetExpenseByIdQuery(expenseId), cancellationToken);

        return result is null ? Results.NotFound() : Results.Ok(result);
    }
}
