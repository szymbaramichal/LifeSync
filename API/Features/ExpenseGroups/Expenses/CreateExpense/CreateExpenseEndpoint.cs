using API.Messaging;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.ExpenseGroups.Expenses.CreateExpense;

public sealed record CreateExpenseRequest(double Amount, string Title, string Description);

public static class CreateExpenseEndpoint
{
    public static RouteGroupBuilder MapCreateExpenseEndpoint(this RouteGroupBuilder group)
    {
        group.MapPost("/", HandleAsync)
            .WithName("CreateExpense")
            .WithSummary("Create a new expense")
            .WithDescription("Creates a new expense and returns the created resource.")
            .Produces<CreateExpenseResult>(StatusCodes.Status201Created);

        return group;
    }

    private static async Task<IResult> HandleAsync(
        [FromRoute] Guid groupId,
        CreateExpenseRequest request,
        IMediator sender,
        CancellationToken cancellationToken)
    {
        var result = await sender.Send(
            new CreateExpenseCommand(request.Amount, request.Title, request.Description),
            cancellationToken);

        return TypedResults.Created($"/api/expenses/{result.Id}", result);
    }
}
