namespace API.Shared;

public class BaseEntity
{
    public Guid Id { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    public DateTime? UpdatedAtUtc { get; set; }

    public Guid CreatedBy { get; set; }
    public Guid? ModifiedBy { get; set; }
}