using API.Messaging;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.ExpenseGroups.Expenses.UpdateExpense;

public static class UpdateExpenseEndpoint
{
    public sealed record UpdateExpenseRequest(double Amount, string Title, string Description);

    public static RouteGroupBuilder MapUpdateExpenseEndpoint(this RouteGroupBuilder group)
    {
        group.MapPut("/{expenseId:guid}", HandleAsync)
            .WithName("UpdateExpense")
            .WithSummary("Update an expense")
            .WithDescription("Updates an existing expense by its unique identifier.")
            .Produces<UpdateExpenseResult>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound);

        return group;
    }

    private static async Task<IResult> HandleAsync(
        [FromRoute] Guid expenseId,
        [FromRoute] Guid groupId,
        UpdateExpenseRequest request,
        IMediator sender,
        CancellationToken cancellationToken)
    {
        var result = await sender.Send(
            new UpdateExpenseCommand(expenseId, request.Amount, request.Title, request.Description),
            cancellationToken);

        if (result is null)
        {
            return TypedResults.NotFound();
        }

        return TypedResults.Ok(result);
    }
}
