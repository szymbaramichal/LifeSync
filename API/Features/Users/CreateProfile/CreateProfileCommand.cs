using API.Data;
using API.Data.Models;
using API.Messaging;
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

        var user = new User
        {
            Id = Guid.NewGuid(),
            FirebaseUID = request.FirebaseUid,
            DisplayName = request.DisplayName.Trim()
        };

        dbContext.Users.Add(user);
        await dbContext.SaveChangesAsync(cancellationToken);

        return new CreateProfileResult(user.Id, user.FirebaseUID, user.DisplayName);
    }
}

