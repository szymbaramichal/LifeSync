using API.Data;
using API.Data.Models;
using API.Messaging;
using API.Shared;
using Microsoft.EntityFrameworkCore;

namespace API.Features.ExpenseGroups.InviteToExpenseGroup;

public record InviteToExpenseGroupCommand(Guid InviterId, Guid ExpenseGroupId, string UserName) : IRequest<bool>;

public class InviteToExpenseGroupCommandHandler(ApplicationDbContext dbContext) : IRequestHandler<InviteToExpenseGroupCommand, bool>
{
    public async Task<bool> Handle(InviteToExpenseGroupCommand request, CancellationToken ct)
    {
        var userExpenseGroup = await dbContext.UserExpenseGroups.FirstOrDefaultAsync(
            x => x.UserId == request.InviterId && x.ExpenseGroupId == request.ExpenseGroupId,
            ct);

        if (userExpenseGroup is null || userExpenseGroup.GroupRole != EntityRole.Owner)
        {
            return false;
        }

        var invitedUserId = await dbContext.Users
            .Where(x => x.Username.Equals(request.UserName, StringComparison.InvariantCultureIgnoreCase))
            .Select(x => x.Id)
            .FirstOrDefaultAsync(ct);

        if (invitedUserId == Guid.Empty)
        {
            return false;
        }

        var newUserGroupEntity = new UserExpenseGroup
        {
            Id = Guid.CreateVersion7(),
            ExpenseGroupId = request.ExpenseGroupId,
            UserId = invitedUserId,
            IsPendingInvitation = true
        };

        dbContext.UserExpenseGroups.Add(newUserGroupEntity);
        await dbContext.SaveChangesAsync(ct);

        return true;
    }
}
