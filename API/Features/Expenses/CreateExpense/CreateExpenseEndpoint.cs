using API.Messaging;
using Microsoft.AspNetCore.Http.HttpResults;

namespace API.Features.Expenses.CreateExpense;

public static class CreateExpenseEndpoint
{
    private sealed record CreateExpenseRequest(double Amount, string Title, string Description);

    public static RouteGroupBuilder MapCreateExpenseEndpoint(this RouteGroupBuilder group)
    {
        group.MapPost("/", Handle)
            .WithName("CreateExpense")
            .WithSummary("Create a new expense")
            .WithDescription("Creates a new expense and returns the created resource.")
            .Produces<CreateExpenseResult>(StatusCodes.Status201Created);

        return group;
    }

    private static async Task<Results<Created<CreateExpenseResult>, ValidationProblem>> Handle(
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