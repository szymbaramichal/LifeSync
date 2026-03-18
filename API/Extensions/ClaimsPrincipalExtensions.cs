using System.Security.Claims;

namespace API.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static string? GetFirebaseUid(this ClaimsPrincipal user)
    {
        return user.FindFirst("user_id")?.Value;
    }
}

