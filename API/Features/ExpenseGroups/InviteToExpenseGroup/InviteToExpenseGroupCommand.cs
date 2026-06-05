using API.Data;
using API.Data.Models;
using API.Messaging.Mediator;
using API.Messaging.SSE;
using API.Messaging.SSE.Models;
using API.Shared;
using Microsoft.EntityFrameworkCore;

namespace API.Features.ExpenseGroups.InviteToExpenseGroup;

public record InviteToExpenseGroupCommand(Guid InviterId, Guid ExpenseGroupId, string UserName) : IRequest<bool>;

public class InviteToExpenseGroupCommandHandler(ApplicationDbContext dbContext,
    NotificationsService notificationsService) : IRequestHandler<InviteToExpenseGroupCommand, bool>
{
    public async Task<bool> Handle(InviteToExpenseGroupCommand request, CancellationToken ct)
    {
        var userExpenseGroup = await dbContext.UserExpenseGroups.Include(x => x.ExpenseGroup).FirstOrDefaultAsync(
            x => x.UserId == request.InviterId && x.ExpenseGroupId == request.ExpenseGroupId,
            ct);

        if (userExpenseGroup is null || userExpenseGroup.GroupRole != EntityRole.Owner)
        {
            return false;
        }

        var invitedUserId = await dbContext.Users
            .Where(x => x.Username.ToLower() == request.UserName.ToLower())
            .Select(x => x.Id)
            .FirstOrDefaultAsync(ct);

        if (invitedUserId == Guid.Empty)
        {
            return false;
        }

        if (dbContext.UserExpenseGroups.Any(x => x.UserId == invitedUserId && x.ExpenseGroupId == request.ExpenseGroupId))
        {
            return false;
        }

        var newUserGroupEntity = new UserExpenseGroup
        {
            Id = Guid.CreateVersion7(),
            ExpenseGroupId = request.ExpenseGroupId,
            UserId = invitedUserId,
            IsPendingInvitation = true,
            GroupRole = EntityRole.Member
        };

        dbContext.UserExpenseGroups.Add(newUserGroupEntity);
        await dbContext.SaveChangesAsync(ct);

        await notificationsService.NotifyAsync(invitedUserId,
            new GroupInvitationNotification(request.ExpenseGroupId,
                userExpenseGroup.ExpenseGroup.Name)
        );

        return true;
    }
}
