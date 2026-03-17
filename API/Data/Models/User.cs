using System.ComponentModel.DataAnnotations;

namespace API.Data.Models;

public class User
{
    public Guid Id { get; set; }
    
    [MaxLength(64)]
    public string FirebaseUID { get; set; } = string.Empty;
    
    [MaxLength(50)]
    public string DisplayName { get; set; } =  string.Empty;
}