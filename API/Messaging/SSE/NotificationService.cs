using System.Collections.Concurrent;
using System.Threading.Channels;
using API.Messaging.SSE.Models;

namespace API.Messaging.SSE;

public class NotificationsService
{
    private readonly ConcurrentDictionary<Guid, Channel<GroupInvitationNotification>> _channels = new();

    public ChannelReader<GroupInvitationNotification> Subscribe(Guid userId)
    {
        var channel = _channels.GetOrAdd(userId, _ => Channel.CreateUnbounded<GroupInvitationNotification>());
        return channel.Reader;
    }

    public void Unsubscribe(Guid userId) => _channels.TryRemove(userId, out _);

    public async Task NotifyAsync(Guid userId, GroupInvitationNotification notification)
    {
        if (_channels.TryGetValue(userId, out var channel))
        {
            await channel.Writer.WriteAsync(notification);
        }
    }
}
