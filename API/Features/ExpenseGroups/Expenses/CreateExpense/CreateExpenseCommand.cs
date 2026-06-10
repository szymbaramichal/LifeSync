using API.Data;
using API.Data.Models;
using API.Messaging.Mediator;
using API.Shared.Models;

namespace API.Features.ExpenseGroups.Expenses.CreateExpense;

public sealed record CreateExpenseCommand(Guid GroupId, double Amount, string Title, string Description, ICollection<UserShareDto> UserShares) : IRequest<CreateExpenseResult>;

public sealed record CreateExpenseResult(
    Guid Id,
    double Amount,
    string Title,
    string Description);

public sealed class CreateExpenseHandler(ApplicationDbContext dbContext) : IRequestHandler<CreateExpenseCommand, CreateExpenseResult>
{
    public async Task<CreateExpenseResult> Handle(CreateExpenseCommand request, CancellationToken cancellationToken)
    {
        var expense = new Expense
        {
            Id = Guid.CreateVersion7(),
            ExpenseGroupId = request.GroupId,
            Amount = request.Amount,
            Title = request.Title.Trim(),
            Description = request.Description.Trim(),
            ExpenseShares = [.. request.UserShares.Select(share => new ExpenseShare
            {
                Id = Guid.CreateVersion7(),
                UserId = share.UserId,
                ShareAmount = share.ShareAmount
            })]
        };

        dbContext.Expenses.Add(expense);
        await dbContext.SaveChangesAsync(cancellationToken);

        return new CreateExpenseResult(expense.Id, expense.Amount, expense.Title, expense.Description);
    }
}
