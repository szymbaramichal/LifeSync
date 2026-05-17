using API.Data;
using API.Messaging;
using API.Shared;
using Microsoft.EntityFrameworkCore;

namespace API.Features.ExpenseGroups.RemoveUserFromExpenseGroup;

public sealed record RemoveUserFromExpenseGroupCommand(Guid RequesterUserId, Guid GroupId, Guid MemberUserId)
    : IRequest<bool>;

public sealed class RemoveUserFromExpenseGroupHandler(ApplicationDbContext dbContext)
    : IRequestHandler<RemoveUserFromExpenseGroupCommand, bool>
{
    public async Task<bool> Handle(RemoveUserFromExpenseGroupCommand request, CancellationToken cancellationToken)
    {
        var requesterMembership = await dbContext.UserExpenseGroups
            .AsNoTracking()
            .FirstOrDefaultAsync(
                x => x.UserId == request.RequesterUserId
                     && x.ExpenseGroupId == request.GroupId
                     && x.GroupRole == EntityRole.Owner,
                cancellationToken);

        if (requesterMembership is null)
        {
            return false;
        }

        var membershipToRemove = await dbContext.UserExpenseGroups
            .FirstOrDefaultAsync(
                x => x.UserId == request.MemberUserId && x.ExpenseGroupId == request.GroupId,
                cancellationToken);

        if (membershipToRemove is null || membershipToRemove.GroupRole == EntityRole.Owner)
        {
            return false;
        }

        dbContext.UserExpenseGroups.Remove(membershipToRemove);
        await dbContext.SaveChangesAsync(cancellationToken);

        return true;
    }
}
