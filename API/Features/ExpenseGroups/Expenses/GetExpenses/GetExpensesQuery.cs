using API.Data;
using API.Messaging.Mediator;
using Microsoft.EntityFrameworkCore;

namespace API.Features.ExpenseGroups.Expenses.GetExpenses;

public sealed record GetExpensesQuery(Guid ExpenseGroupId) : IRequest<List<GetExpensesResult>>;

public sealed record GetExpensesResult(Guid Id, double Amount, string Title, string Description);

public sealed class GetExpensesHandler(ApplicationDbContext dbContext) : IRequestHandler<GetExpensesQuery, List<GetExpensesResult>>
{
    public Task<List<GetExpensesResult>> Handle(GetExpensesQuery request, CancellationToken cancellationToken)
    {
        return dbContext.Expenses
            .AsNoTracking()
            .Where(x => x.ExpenseGroupId == request.ExpenseGroupId)
            .OrderByDescending(x => x.Id)
            .Select(x => new GetExpensesResult(x.Id, x.Amount, x.Title, x.Description))
            .ToListAsync(cancellationToken);
    }
}
