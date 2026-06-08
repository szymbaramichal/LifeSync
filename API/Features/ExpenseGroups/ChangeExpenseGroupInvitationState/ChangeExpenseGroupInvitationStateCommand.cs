using API.Data;
using API.Messaging.Mediator;
using Microsoft.EntityFrameworkCore;

namespace API.Features.ExpenseGroups.ChangeExpenseGroupInvitationState;

public sealed record ChangeExpenseGroupInvitationStateCommand(Guid UserId, Guid ExpenseGroupId, string Action)
    : IRequest<bool>;

public sealed class ChangeExpenseGroupInvitationStateHandler(ApplicationDbContext dbContext)
    : IRequestHandler<ChangeExpenseGroupInvitationStateCommand, bool>
{
    public async Task<bool> Handle(ChangeExpenseGroupInvitationStateCommand request, CancellationToken cancellationToken)
    {
        var userExpenseGroup = await dbContext.UserExpenseGroups
            .FirstOrDefaultAsync(
                x => x.UserId == request.UserId
                     && x.ExpenseGroupId == request.ExpenseGroupId
                     && x.IsPendingInvitation,
                cancellationToken);

        if (userExpenseGroup is null)
        {
            return false;
        }

        if (string.Equals(request.Action, "accept", StringComparison.OrdinalIgnoreCase))
        {
            userExpenseGroup.IsPendingInvitation = false;
        }
        else if (string.Equals(request.Action, "decline", StringComparison.OrdinalIgnoreCase))
        {
            dbContext.UserExpenseGroups.Remove(userExpenseGroup);
        }
        else
        {
            return false;
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }
}
