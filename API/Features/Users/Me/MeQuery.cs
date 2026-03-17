using API.Data;
using API.Messaging;
using Microsoft.EntityFrameworkCore;

namespace API.Features.Users.Me;

public sealed record MeQuery(string FirebaseUid) : IRequest<MeResult?>;

public sealed record MeResult(Guid Id, string FirebaseUid, string DisplayName);

public sealed class MeHandler(ApplicationDbContext dbContext) : IRequestHandler<MeQuery, MeResult?>
{
    public async Task<MeResult?> Handle(MeQuery request, CancellationToken cancellationToken)
    {
        var user = await dbContext.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.FirebaseUID == request.FirebaseUid, cancellationToken);

        if (user is null)
        {
            return null;
        }

        return new MeResult(user.Id, user.FirebaseUID, user.DisplayName);
    }
}

