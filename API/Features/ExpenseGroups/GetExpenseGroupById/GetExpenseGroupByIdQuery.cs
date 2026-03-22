using API.Data;
using API.Messaging;
using API.Shared;
using Microsoft.EntityFrameworkCore;

namespace API.Features.ExpenseGroups.GetExpenseGroupById;

public sealed record GetExpenseGroupByIdQuery(Guid UserId, Guid GroupId) : IRequest<GetExpenseGroupByIdResult?>;

public sealed record GetExpenseGroupByIdResult(Guid Id, string Name, bool IsPrivate, EntityRole GroupRole);

public sealed class GetExpenseGroupByIdHandler(ApplicationDbContext dbContext)
    : IRequestHandler<GetExpenseGroupByIdQuery, GetExpenseGroupByIdResult?>
{
    public Task<GetExpenseGroupByIdResult?> Handle(GetExpenseGroupByIdQuery request, CancellationToken cancellationToken)
    {
        return dbContext.UserExpenseGroups
            .AsNoTracking()
            .Where(x => x.UserId == request.UserId && x.ExpenseGroupId == request.GroupId)
            .Select(x => new GetExpenseGroupByIdResult(
                x.ExpenseGroupId,
                x.ExpenseGroup.Name,
                x.ExpenseGroup.IsPrivate,
                x.GroupRole))
            .FirstOrDefaultAsync(cancellationToken);
    }
}

