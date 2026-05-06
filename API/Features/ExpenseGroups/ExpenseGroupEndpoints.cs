using API.Features.ExpenseGroups.CreateExpenseGroup;
using API.Features.ExpenseGroups.DeleteExpenseGroup;
using API.Features.ExpenseGroups.Expenses;
using API.Features.ExpenseGroups.GetExpenseGroupById;
using API.Features.ExpenseGroups.GetExpenseGroups;
using API.Features.ExpenseGroups.UpdateExpenseGroup;

namespace API.Features.ExpenseGroups;

public static class ExpenseGroupEndpoints
{
    public static void MapExpenseGroupEndpoints(this IEndpointRouteBuilder app)
    {
        var groups = app.MapGroup("/api/expense-groups")
            .RequireAuthorization()
            .WithTags("Expense groups");

        groups.MapCreateExpenseGroupEndpoint();
        groups.MapGetExpenseGroupsEndpoint();
        groups.MapGetExpenseGroupByIdEndpoint();
        groups.MapUpdateExpenseGroupEndpoint();
        groups.MapDeleteExpenseGroupEndpoint();

        var groupById = groups.MapGroup("/{groupId:guid}");
        groupById.MapExpenseGroupExpenseEndpoints();
    }
}