using API.Data;
using API.Data.Models;
using API.Messaging;
using API.Shared;
using Microsoft.EntityFrameworkCore;

namespace API.Features.Users.CreateProfile;

public sealed record CreateProfileCommand(string FirebaseUid, string DisplayName) : IRequest<CreateProfileResult?>;

public sealed record CreateProfileResult(Guid Id, string FirebaseUid, string DisplayName);

public sealed class CreateProfileHandler(ApplicationDbContext dbContext)
    : IRequestHandler<CreateProfileCommand, CreateProfileResult?>
{
    public async Task<CreateProfileResult?> Handle(CreateProfileCommand request, CancellationToken cancellationToken)
    {
        var alreadyExists = await dbContext.Users
            .AnyAsync(x => x.FirebaseUID == request.FirebaseUid, cancellationToken);

        if (alreadyExists)
        {
            return null;
        }

        var userId = Guid.CreateVersion7();
        var user = new User
        {
            Id = userId,
            FirebaseUID = request.FirebaseUid,
            DisplayName = request.DisplayName.Trim()
        };

        var expenseGroupId = Guid.CreateVersion7();
        var expenseGroup = new ExpenseGroup()
        {
            Id = expenseGroupId,
            Name = "Private Expense Group",
            IsPrivate = true
        };

        var userExpenseGroup = new UserExpenseGroup()
        {
            Id = Guid.CreateVersion7(),
            ExpenseGroupId = expenseGroupId,
            UserId = userId,
            GroupRole = EntityRole.Owner
        };

        await dbContext.Users.AddAsync(user ,cancellationToken);
        await dbContext.ExpenseGroups.AddAsync(expenseGroup, cancellationToken);
        await dbContext.UserExpenseGroups.AddAsync(userExpenseGroup, cancellationToken);
        
        await dbContext.SaveChangesAsync(cancellationToken);

        return new CreateProfileResult(user.Id, user.FirebaseUID, user.DisplayName);
    }
}

