using API.Data;
using API.Messaging.Mediator;
using Microsoft.EntityFrameworkCore;

namespace API.Features.Users.UpdateProfile;

public sealed record UpdateProfileCommand(Guid UserId, string Description) : IRequest<UpdateProfileResult?>;

public sealed record UpdateProfileResult(Guid Id, string Description);

public sealed class UpdateProfileHandler(ApplicationDbContext dbContext) : IRequestHandler<UpdateProfileCommand, UpdateProfileResult?>
{
    public async Task<UpdateProfileResult?> Handle(UpdateProfileCommand request, CancellationToken cancellationToken)
    {
        var user = await dbContext.Users
            .FirstOrDefaultAsync(x => x.Id == request.UserId, cancellationToken);

        if (user is null)
        {
            return null;
        }

        user.Description = request.Description?.Trim() ?? string.Empty;

        await dbContext.SaveChangesAsync(cancellationToken);

        return new UpdateProfileResult(user.Id, user.Description);
    }
}
