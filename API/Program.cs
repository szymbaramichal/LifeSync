using API.Extensions;
using API.Features.Expenses;
using API.Features.Users;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddHttpContextAccessor();
builder.Services.AddCustomMediator(typeof(Program).Assembly);
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
}

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.MapExpenseEndpoints();
app.MapUserEndpoints();

app.Run();