using System.Security.Claims;
using API.Shared;

namespace API.Extensions;

public static class ClaimsPrincipalExtensions
{
    extension(ClaimsPrincipal user)
    {
        public string? GetFirebaseUid()
        {
            return user.FindFirst(AuthConstants.FirebaseUidClaimType)?.Value;
        }

        public Guid GetUserId()
        {
            return Guid.Parse(
                user.FindFirst(AuthConstants.UserIdClaimType)?.Value 
                ?? throw new InvalidOperationException("User ID claim not found")
            );     
        }
    }
}

