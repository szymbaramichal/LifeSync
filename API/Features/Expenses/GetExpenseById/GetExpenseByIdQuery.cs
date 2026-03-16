using API.Data;
using API.Messaging;
using Microsoft.EntityFrameworkCore;

namespace API.Features.Expenses.GetExpenseById;

public sealed record GetExpenseByIdQuery(Guid Id) : IRequest<GetExpenseByIdResult?>;

public sealed record GetExpenseByIdResult(Guid Id, double Amount, string Title, string Description);

public sealed class GetExpenseByIdHandler(ApplicationDbContext dbContext) : IRequestHandler<GetExpenseByIdQuery, GetExpenseByIdResult?>
{
    public async Task<GetExpenseByIdResult?> Handle(GetExpenseByIdQuery request, CancellationToken cancellationToken)
    {
        var expense = await dbContext.Expenses
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (expense is null)
            return null;
        
        return new GetExpenseByIdResult(
            expense.Id,
            expense.Amount,
            expense.Title,
            expense.Description);
    }
}