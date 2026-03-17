using API.Extensions;
using API.Features.Expenses;
using API.Features.Users;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddOpenApi();

builder.Services.AddCustomMediator(typeof(Program).Assembly);
builder.Services.RegisterAuthentication(builder.Configuration);
builder.Services.AddCors(builder.Configuration);

var connectionString = builder.Configuration.GetConnectionString("DbConnection")
    ?? throw new InvalidOperationException("Connection string 'DbConnection' was not found.");

builder.Services.AddDatabase(connectionString);

var app = builder.Build();
app.ApplyDatabaseMigrations();

// Configure the HTTP request pipeline.
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