using API.Extensions;
using API.Messaging.SSE;

namespace API.Features.Notifications;

public static class NotificationsEndpoint
{
    public static void MapNotificationsEndpoint(this IEndpointRouteBuilder app)
    {
        app.MapGet("/notifications/stream", HandleAsync)
            .RequireAuthorization()
            .WithTags("Notifications");
    }

    private static async Task<IResult> HandleAsync(
        HttpContext context,
        NotificationsService notificationsService,
        CancellationToken cancellationToken)
    {
        var userId = context.User.GetUserId();

        var reader = notificationsService.Subscribe(userId);

        return Results.ServerSentEvents(
            reader.ReadAllAsync(cancellationToken),
            eventType: "notifications"
        );
    }
}
