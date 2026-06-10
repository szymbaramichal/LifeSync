using API.Messaging.Mediator;
using API.Shared.Models;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.ExpenseGroups.Expenses.CreateExpense;

public sealed record CreateExpenseRequest(double Amount, string Title, string Description, ICollection<UserShareDto> UserShares);

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
            new CreateExpenseCommand(groupId, request.Amount, request.Title, request.Description, request.UserShares),
            cancellationToken);

        return TypedResults.Created($"/api/expense-groups/{groupId}/expenses/{result.Id}", result);
    }
}

public class CreateExpenseRequestValidator : AbstractValidator<CreateExpenseRequest>
{
    public CreateExpenseRequestValidator()
    {
        RuleFor(x => x.Amount).GreaterThan(0).WithMessage("Expense amount must be higher than 0.");
        RuleFor(x => x.UserShares)
            .Must((x, shares) => shares != null && Math.Abs(shares.Sum(s => s.ShareAmount) - x.Amount) < 0.01)
            .WithMessage("Sum of all shares must be equal to amount of expense.");
    }
}
