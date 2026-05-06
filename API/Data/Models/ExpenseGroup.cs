using System.ComponentModel.DataAnnotations;
using API.Shared;

namespace API.Data.Models;

public class ExpenseGroup : BaseEntity
{
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;
    public bool IsPrivate { get; set; } = false;
}