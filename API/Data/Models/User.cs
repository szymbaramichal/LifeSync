using System.ComponentModel.DataAnnotations;
using API.Shared;

namespace API.Data.Models;

public class User : BaseEntity
{
    [MaxLength(64)]
    public string FirebaseUID { get; set; } = string.Empty;
    
    [MaxLength(50)]
    public string DisplayName { get; set; } =  string.Empty;
}