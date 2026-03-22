using API.Messaging;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.ExpenseGroups.Expenses.DeleteExpense;

public static class DeleteExpenseEndpoint
{
    public static RouteGroupBuilder MapDeleteExpenseEndpoint(this RouteGroupBuilder group)
    {
        group.MapDelete("/{expenseId:guid}", HandleAsync)
            .WithName("DeleteExpense")
            .WithSummary("Delete an expense")
            .WithDescription("Deletes an expense by its unique identifier.")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound);

        return group;
    }

    private static async Task<IResult> HandleAsync(
        [FromRoute] Guid expenseId,
        [FromRoute] Guid groupId,
        IMediator sender,
        CancellationToken cancellationToken)
    {
        var deleted = await sender.Send(new DeleteExpenseCommand(expenseId), cancellationToken);

        if (!deleted)
        {
            return TypedResults.NotFound();
        }

        return TypedResults.NoContent();
    }
}
