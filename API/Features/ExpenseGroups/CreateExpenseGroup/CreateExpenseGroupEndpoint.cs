using API.Extensions;
using API.Messaging;

namespace API.Features.ExpenseGroups.CreateExpenseGroup;

public sealed record CreateExpenseGroupRequest(string Name, bool IsPrivate);

public static class CreateExpenseGroupEndpoint
{
    public static RouteGroupBuilder MapCreateExpenseGroupEndpoint(this RouteGroupBuilder group)
    {
        group.MapPost("/", HandleAsync)
            .WithName("CreateExpenseGroup")
            .WithSummary("Create a new expense group")
            .WithDescription("Creates an expense group and assigns the current user as owner.")
            .Produces<CreateExpenseGroupResult>(StatusCodes.Status201Created)
            .Produces(StatusCodes.Status401Unauthorized);

        return group;
    }

    private static async Task<IResult> HandleAsync(
        CreateExpenseGroupRequest request,
        HttpContext httpContext,
        IMediator sender,
        CancellationToken cancellationToken)
    {
        var userId = httpContext.User.GetUserId();

        var result = await sender.Send(
            new CreateExpenseGroupCommand(userId, request.Name, request.IsPrivate),
            cancellationToken);

        return TypedResults.Created($"/api/expense-groups/{result.Id}", result);
    }
}

