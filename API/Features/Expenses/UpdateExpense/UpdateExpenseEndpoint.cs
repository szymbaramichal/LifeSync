using API.Messaging;

namespace API.Features.Expenses.UpdateExpense;

public static class UpdateExpenseEndpoint
{
    public sealed record UpdateExpenseRequest(double Amount, string Title, string Description);
    
    public static RouteGroupBuilder MapUpdateExpenseEndpoint(this RouteGroupBuilder group)
    {
        group.MapPut("/{id:guid}", HandleAsync)
            .WithName("UpdateExpense")
            .WithSummary("Update an expense")
            .WithDescription("Updates an existing expense by its unique identifier.")
            .Produces<UpdateExpenseResult>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound);

        return group;
    }

    private static async Task<IResult> HandleAsync(
        Guid id,
        UpdateExpenseRequest request,
        IMediator sender,
        CancellationToken cancellationToken)
    {
        var result = await sender.Send(
            new UpdateExpenseCommand(id, request.Amount, request.Title, request.Description),
            cancellationToken);

        if (result is null)
        {
            return TypedResults.NotFound();
        }

        return TypedResults.Ok(result);
    }
}