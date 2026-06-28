using API.Data;
using API.Extensions;
using API.Messaging.Mediator;
using FluentValidation;

namespace API.Features.Users.UpdateProfile;

public sealed record UpdateProfileRequest(string Description);

public static class UpdateProfileEndpoint
{
    public static RouteGroupBuilder MapUpdateProfileEndpoint(this RouteGroupBuilder group)
    {
        group.MapPut("/profile", HandleAsync)
            .WithName("UpdateProfile")
            .WithSummary("Update current user profile")
            .WithDescription("Updates the profile of the authenticated Firebase user.")
            .Produces<UpdateProfileResult>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status401Unauthorized)
            .Produces(StatusCodes.Status404NotFound)
            .Produces(StatusCodes.Status422UnprocessableEntity)
            .RequireAuthorization();

        return group;
    }

    private static async Task<IResult> HandleAsync(
        UpdateProfileRequest request,
        HttpContext httpContext,
        IMediator sender,
        IValidator<UpdateProfileRequest> validator,
        CancellationToken cancellationToken)
    {
        var validationResult = await validator.ValidateAsync(request, cancellationToken);

        if (!validationResult.IsValid)
        {
            return TypedResults.UnprocessableEntity(validationResult);
        }

        var userId = httpContext.User.GetUserId();

        var result = await sender.Send(
            new UpdateProfileCommand(userId, request.Description),
            cancellationToken);

        if (result is null)
        {
            return TypedResults.NotFound();
        }

        return TypedResults.Ok(result);
    }
}

public class UpdateProfileRequestValidator : AbstractValidator<UpdateProfileRequest>
{
    public UpdateProfileRequestValidator(ApplicationDbContext dbContext, IHttpContextAccessor httpContextAccessor)
    {
        RuleFor(x => x.Description)
            .NotNull().WithMessage("Description is required.")
            .MaximumLength(500).WithMessage("Description cannot exceed 500 characters.");
    }
}
