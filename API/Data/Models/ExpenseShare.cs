using API.Shared;

namespace API.Data.Models;

public class ExpenseShare : BaseEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public Guid ExpenseId { get; set; }
    public Expense Expense { get; set; } = null!;

    public double ShareAmount { get; set; }
}
