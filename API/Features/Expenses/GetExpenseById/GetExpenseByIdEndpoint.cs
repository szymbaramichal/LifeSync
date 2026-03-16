using API.Messaging;

namespace API.Features.Expenses.GetExpenseById;

public static class GetExpenseByIdEndpoint
{
    public static RouteGroupBuilder MapGetExpenseByIdEndpoint(this RouteGroupBuilder group)
    {
        group.MapGet("/{id:guid}", HandleAsync)
            .WithName("GetExpenseById")
            .WithSummary("Get an expense by id")
            .WithDescription("Returns a single expense by its unique identifier.")
            .Produces<GetExpenseByIdResult>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound);

        return group;
    }

    private static async Task<IResult> HandleAsync(
        Guid id,
        IMediator sender,
        CancellationToken cancellationToken)
    {
        var result = await sender.Send(new GetExpenseByIdQuery(id), cancellationToken);

        return result is null ? Results.NotFound() : Results.Ok(result);
    }
}