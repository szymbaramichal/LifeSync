using API.Features.ExpenseGroups.Expenses.CreateExpense;
using API.Features.ExpenseGroups.Expenses.DeleteExpense;
using API.Features.ExpenseGroups.Expenses.GetExpenseById;
using API.Features.ExpenseGroups.Expenses.GetExpenses;
using API.Features.ExpenseGroups.Expenses.UpdateExpense;

namespace API.Features.ExpenseGroups.Expenses;

public static class ExpenseGroupExpenseEndpoints
{
    public static void MapExpenseGroupExpenseEndpoints(this RouteGroupBuilder groupById)
    {
        var expenses = groupById.MapGroup("/expenses")
            .WithTags("Expenses");

        expenses.MapCreateExpenseEndpoint();
        expenses.MapGetExpensesEndpoint();
        expenses.MapGetExpenseByIdEndpoint();
        expenses.MapUpdateExpenseEndpoint();
        expenses.MapDeleteExpenseEndpoint();
    }
}