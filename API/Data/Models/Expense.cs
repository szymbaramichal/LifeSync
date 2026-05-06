using System.ComponentModel.DataAnnotations;
using API.Shared;

namespace API.Data.Models;

public class Expense : BaseEntity
{
    public double Amount { get; set; }
    
    [MaxLength(50)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;
}
