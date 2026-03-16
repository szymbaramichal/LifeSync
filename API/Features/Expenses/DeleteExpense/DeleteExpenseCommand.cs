using API.Data;
using API.Messaging;
using Microsoft.EntityFrameworkCore;

namespace API.Features.Expenses.DeleteExpense;

public sealed record DeleteExpenseCommand(Guid Id) : IRequest<bool>;

public sealed class DeleteExpenseHandler(ApplicationDbContext dbContext) : IRequestHandler<DeleteExpenseCommand, bool>
{
    public async Task<bool> Handle(DeleteExpenseCommand request, CancellationToken cancellationToken)
    {
        var expense = await dbContext.Expenses
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (expense is null)
        {
            return false;
        }

        dbContext.Expenses.Remove(expense);
        await dbContext.SaveChangesAsync(cancellationToken);

        return true;
    }
}

