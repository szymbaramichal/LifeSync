using System.ComponentModel.DataAnnotations;

namespace API.Data.Models;

public class Expense
{
    public Guid Id { get; set; }
    
    public double Amount { get; set; }
    
    [MaxLength(50)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;
}
