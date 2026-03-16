namespace API.Messaging;

public sealed class Mediator(IServiceProvider serviceProvider) : IMediator
{
    public Task<TResponse> Send<TResponse>(IRequest<TResponse> request, CancellationToken ct = default)
    {
        var requestType = request.GetType();
        var handlerType = typeof(IRequestHandler<,>).MakeGenericType(requestType, typeof(TResponse));
        var handler = serviceProvider.GetService(handlerType) 
                      ?? throw new InvalidOperationException($"No handler registered for {requestType.Name}");
        
        var method = handlerType.GetMethod(nameof(IRequestHandler<,>.Handle))
                     ?? throw new InvalidOperationException("Handler method not found.");
        
        var result = method.Invoke(handler, [request, ct]);
        return (Task<TResponse>)result!;
    }
}