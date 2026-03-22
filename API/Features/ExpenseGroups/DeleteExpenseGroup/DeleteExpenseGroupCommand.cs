using API.Data;
using API.Messaging;
using API.Shared;
using Microsoft.EntityFrameworkCore;

namespace API.Features.ExpenseGroups.DeleteExpenseGroup;

public sealed record DeleteExpenseGroupCommand(Guid UserId, Guid GroupId) : IRequest<bool>;

public sealed class DeleteExpenseGroupHandler(ApplicationDbContext dbContext)
    : IRequestHandler<DeleteExpenseGroupCommand, bool>
{
    public async Task<bool> Handle(DeleteExpenseGroupCommand request, CancellationToken cancellationToken)
    {
        var membership = await dbContext.UserExpenseGroups
            .AsNoTracking()
            .FirstOrDefaultAsync(
                x => x.UserId == request.UserId && x.ExpenseGroupId == request.GroupId && x.GroupRole == EntityRole.Owner,
                cancellationToken);

        if (membership is null)
        {
            return false;
        }

        var group = await dbContext.ExpenseGroups
            .FirstOrDefaultAsync(x => x.Id == request.GroupId, cancellationToken);

        if (group is null)
        {
            return false;
        }

        var membershipsToRemove = await dbContext.UserExpenseGroups
            .Where(x => x.ExpenseGroupId == request.GroupId)
            .ToListAsync(cancellationToken);

        dbContext.UserExpenseGroups.RemoveRange(membershipsToRemove);
        dbContext.ExpenseGroups.Remove(group);

        await dbContext.SaveChangesAsync(cancellationToken);

        return true;
    }
}

