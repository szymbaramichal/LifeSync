using API.Features.Expenses.CreateExpense;
using API.Features.Expenses.DeleteExpense;
using API.Features.Expenses.GetExpenseById;
using API.Features.Expenses.GetExpenses;
using API.Features.Expenses.UpdateExpense;

namespace API.Features.Expenses;

public static class ExpenseEndpoints
{
    public static void MapExpenseEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/expenses")
            .WithTags("Expenses");

        group.MapCreateExpenseEndpoint();
        group.MapGetExpensesEndpoint();
        group.MapGetExpenseByIdEndpoint();
        group.MapUpdateExpenseEndpoint();
        group.MapDeleteExpenseEndpoint();
    }
}