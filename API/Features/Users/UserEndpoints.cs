using API.Features.Users.CreateProfile;
using API.Features.Users.Me;
using API.Features.Users.UpdateProfile;

namespace API.Features.Users;

public static class UserEndpoints
{
    public static void MapUserEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/users")
            .WithTags("Users");

        group.MapCreateProfileEndpoint();
        group.MapMeEndpoint();
        group.MapUpdateProfileEndpoint();
    }
}

