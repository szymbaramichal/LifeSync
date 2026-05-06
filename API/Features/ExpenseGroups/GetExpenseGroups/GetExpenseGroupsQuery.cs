using API.Data;
using API.Messaging;
using API.Shared;
using Microsoft.EntityFrameworkCore;

namespace API.Features.ExpenseGroups.GetExpenseGroups;

public sealed record GetExpenseGroupsQuery(Guid UserId) : IRequest<List<GetExpenseGroupsResult>>;

public sealed record GetExpenseGroupsResult(Guid Id, string Name, bool IsPrivate, EntityRole GroupRole);

public sealed class GetExpenseGroupsHandler(ApplicationDbContext dbContext)
    : IRequestHandler<GetExpenseGroupsQuery, List<GetExpenseGroupsResult>>
{
    public Task<List<GetExpenseGroupsResult>> Handle(GetExpenseGroupsQuery request, CancellationToken cancellationToken)
    {
        return dbContext.UserExpenseGroups
            .AsNoTracking()
            .Where(x => x.UserId == request.UserId)
            .OrderByDescending(x => x.CreatedAtUtc)
            .Select(x => new GetExpenseGroupsResult(
                x.ExpenseGroupId,
                x.ExpenseGroup.Name,
                x.ExpenseGroup.IsPrivate,
                x.GroupRole))
            .ToListAsync(cancellationToken);
    }
}

