using API.Data;
using API.Messaging;
using API.Shared;
using Microsoft.EntityFrameworkCore;

namespace API.Features.ExpenseGroups.UpdateExpenseGroup;

public sealed record UpdateExpenseGroupCommand(Guid UserId, Guid GroupId, string Name, bool IsPrivate)
    : IRequest<UpdateExpenseGroupResult?>;

public sealed record UpdateExpenseGroupResult(Guid Id, string Name, bool IsPrivate);

public sealed class UpdateExpenseGroupHandler(ApplicationDbContext dbContext)
    : IRequestHandler<UpdateExpenseGroupCommand, UpdateExpenseGroupResult?>
{
    public async Task<UpdateExpenseGroupResult?> Handle(UpdateExpenseGroupCommand request, CancellationToken cancellationToken)
    {
        var membership = await dbContext.UserExpenseGroups
            .Include(x => x.ExpenseGroup)
            .FirstOrDefaultAsync(
                x => x.UserId == request.UserId && x.ExpenseGroupId == request.GroupId && x.GroupRole == EntityRole.Owner,
                cancellationToken);

        if (membership is null)
        {
            return null;
        }

        membership.ExpenseGroup.Name = request.Name.Trim();
        membership.ExpenseGroup.IsPrivate = request.IsPrivate;

        await dbContext.SaveChangesAsync(cancellationToken);

        return new UpdateExpenseGroupResult(
            membership.ExpenseGroup.Id,
            membership.ExpenseGroup.Name,
            membership.ExpenseGroup.IsPrivate);
    }
}

