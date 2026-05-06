using API.Messaging;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.ExpenseGroups.Expenses.GetExpenses;

public static class GetExpensesEndpoint
{
    public static RouteGroupBuilder MapGetExpensesEndpoint(this RouteGroupBuilder group)
    {
        group.MapGet("/", HandleAsync)
            .WithName("GetExpenses")
            .WithSummary("Get all expenses")
            .WithDescription("Returns all expenses.")
            .Produces<List<GetExpensesResult>>(StatusCodes.Status200OK);

        return group;
    }

    private static async Task<IResult> HandleAsync(
        [FromRoute] Guid groupId,
        IMediator sender,
        CancellationToken cancellationToken)
    {
        var response = await sender.Send(new GetExpensesQuery(), cancellationToken);

        return Results.Ok(response);
    }
}
