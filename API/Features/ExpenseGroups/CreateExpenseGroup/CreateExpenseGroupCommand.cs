using API.Data;
using API.Data.Models;
using API.Messaging;
using API.Shared;

namespace API.Features.ExpenseGroups.CreateExpenseGroup;

public sealed record CreateExpenseGroupCommand(Guid UserId, string Name, bool IsPrivate)
    : IRequest<CreateExpenseGroupResult>;

public sealed record CreateExpenseGroupResult(Guid Id, string Name, bool IsPrivate);

public sealed class CreateExpenseGroupHandler(ApplicationDbContext dbContext)
    : IRequestHandler<CreateExpenseGroupCommand, CreateExpenseGroupResult>
{
    public async Task<CreateExpenseGroupResult> Handle(CreateExpenseGroupCommand request, CancellationToken cancellationToken)
    {
        var groupId = Guid.CreateVersion7();

        var expenseGroup = new ExpenseGroup
        {
            Id = groupId,
            Name = request.Name.Trim(),
            IsPrivate = request.IsPrivate
        };

        var userExpenseGroup = new UserExpenseGroup
        {
            Id = Guid.CreateVersion7(),
            UserId = request.UserId,
            ExpenseGroupId = groupId,
            GroupRole = EntityRole.Owner
        };

        await dbContext.ExpenseGroups.AddAsync(expenseGroup, cancellationToken);
        await dbContext.UserExpenseGroups.AddAsync(userExpenseGroup, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);

        return new CreateExpenseGroupResult(expenseGroup.Id, expenseGroup.Name, expenseGroup.IsPrivate);
    }
}

