using API.Data;
using API.Messaging.Mediator;
using API.Shared;
using Microsoft.EntityFrameworkCore;

namespace API.Features.ExpenseGroups.GetExpenseGroupById;

public sealed record GetExpenseGroupByIdQuery(Guid UserId, Guid GroupId) : IRequest<GetExpenseGroupByIdResult?>;

public sealed record GetExpenseGroupByIdMemberResult(Guid UserId, string Username, EntityRole GroupRole, bool IsPendingInvitation);

public sealed record GetExpenseGroupByIdResult(
    Guid Id,
    string Name,
    bool IsPrivate,
    EntityRole GroupRole,
    IReadOnlyList<GetExpenseGroupByIdMemberResult> Members);

public sealed class GetExpenseGroupByIdHandler(ApplicationDbContext dbContext)
    : IRequestHandler<GetExpenseGroupByIdQuery, GetExpenseGroupByIdResult?>
{
    public async Task<GetExpenseGroupByIdResult?> Handle(GetExpenseGroupByIdQuery request, CancellationToken cancellationToken)
    {
        var requesterMembership = await dbContext.UserExpenseGroups
            .AsNoTracking()
            .Where(x => x.UserId == request.UserId && x.ExpenseGroupId == request.GroupId)
            .Select(x => new GetExpenseGroupByIdResult(
                x.ExpenseGroupId,
                x.ExpenseGroup.Name,
                x.ExpenseGroup.IsPrivate,
                x.GroupRole,
                Array.Empty<GetExpenseGroupByIdMemberResult>()))
            .FirstOrDefaultAsync(cancellationToken);

        if (requesterMembership is null)
        {
            return null;
        }

        var shouldIncludePendingInvitations = requesterMembership.GroupRole == EntityRole.Owner;

        var members = await dbContext.UserExpenseGroups
            .AsNoTracking()
            .Where(x => x.ExpenseGroupId == request.GroupId)
            .Where(x => shouldIncludePendingInvitations || !x.IsPendingInvitation)
            .Select(x => new GetExpenseGroupByIdMemberResult(
                x.UserId,
                x.User.Username,
                x.GroupRole,
                x.IsPendingInvitation))
            .ToListAsync(cancellationToken);

        return requesterMembership with { Members = members };
    }
}
