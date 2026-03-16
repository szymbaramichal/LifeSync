using API.Data;
using API.Messaging;
using Microsoft.EntityFrameworkCore;

namespace API.Features.Expenses.UpdateExpense;

public sealed record UpdateExpenseCommand(Guid Id, double Amount, string Title, string Description) : IRequest<UpdateExpenseResult?>;

public sealed record UpdateExpenseResult(Guid Id, double Amount, string Title, string Description);

public sealed class UpdateExpenseHandler(ApplicationDbContext dbContext) : IRequestHandler<UpdateExpenseCommand, UpdateExpenseResult?>
{
    public async Task<UpdateExpenseResult?> Handle(UpdateExpenseCommand request, CancellationToken cancellationToken)
    {
        var expense = await dbContext.Expenses
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (expense is null)
        {
            return null;
        }

        expense.Amount = request.Amount;
        expense.Title = request.Title.Trim();
        expense.Description = request.Description.Trim();

        await dbContext.SaveChangesAsync(cancellationToken);

        return new UpdateExpenseResult(expense.Id, expense.Amount, expense.Title, expense.Description);
    }
}

