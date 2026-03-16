using API.Extensions;
using API.Features.Expenses;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddOpenApi();

builder.Services.AddCustomMediator(typeof(Program).Assembly);

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

app.MapExpenseEndpoints();

app.Run();