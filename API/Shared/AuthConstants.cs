namespace API.Shared;

public static class AuthConstants
{
    public const string UserIdClaimType = "app_user_id"; 
    public const string FirebaseUidClaimType = "user_id";
    
    public const string HasAppUserIdPolicy = "HasAppUserId";
    public const string AuthenticatedOnlyPolicy = "AuthenticatedOnly";
}