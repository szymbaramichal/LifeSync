using API.Shared;

namespace API.Data.Models;

public class ExpenseGroup : BaseEntity
{
    public string Name { get; set; } = string.Empty;
}