using API.Extensions;
using API.Features.ExpenseGroups;
using API.Features.Notifications;
using API.Features.Users;
using API.Messaging.SSE;
using API.Messaging.SSE.Models;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddHttpContextAccessor();
builder.Services.AddCustomMediator(typeof(Program).Assembly);
builder.Services.AddSSE();
builder.Services.RegisterAuthentication(builder.Configuration);
builder.Services.AddCors(builder.Configuration);
builder.Services.AddFluentValidators();
builder.Services.AddDatabase(builder.Configuration);

var app = builder.Build();
app.ApplyDatabaseMigrations();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();

    app.MapPost("/notifications/seed", async (
        NotificationsService notificationsService,
        HttpContext context) =>
    {
        var userId = context.User.GetUserId();

        await notificationsService.NotifyAsync(userId, new GroupInvitationNotification(Guid.NewGuid(),"Test Group"));

        return Results.Ok("Notification sent");
    })
    .RequireAuthorization()
    .WithTags("Notifications");
}

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.MapExpenseGroupEndpoints();
app.MapUserEndpoints();
app.MapNotificationsEndpoint();

app.Run();
