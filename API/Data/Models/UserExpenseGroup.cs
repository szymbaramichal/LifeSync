using API.Shared;

namespace API.Data.Models;

public class UserExpenseGroup : BaseEntity
{
    public Guid ExpenseGroupId { get; set; }
    public ExpenseGroup ExpenseGroup { get; set; } = null!;

    public User User { get; set; } = null!;
    public Guid UserId { get; set; }

    public EntityRole GroupRole { get; set; }
}