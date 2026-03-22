using System.Security.Claims;
using API.Shared;

namespace API.Extensions;

public static class ClaimsPrincipalExtensions
{
    extension(ClaimsPrincipal user)
    {
        public string? GetFirebaseUid()
        {
            return user.FindFirst(Constants.FirebaseUidClaimType)?.Value;
        }

        public string? GetAppId()
        {
            return user.FindFirst(Constants.UserIdClaimType)?.Value;
        }
    }
}

