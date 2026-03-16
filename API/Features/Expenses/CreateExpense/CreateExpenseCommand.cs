using API.Data;
using API.Data.Models;
using API.Messaging;

namespace API.Features.Expenses.CreateExpense;

public sealed record CreateExpenseCommand(double Amount, string Title, string Description) : IRequest<CreateExpenseResult>;

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
            Id = Guid.NewGuid(),
            Amount = request.Amount,
            Title = request.Title.Trim(),
            Description = request.Description.Trim()
        };

        dbContext.Expenses.Add(expense);
        await dbContext.SaveChangesAsync(cancellationToken);

        return new CreateExpenseResult(expense.Id, expense.Amount, expense.Title, expense.Description);
    }
}

