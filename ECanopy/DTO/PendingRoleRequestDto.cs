namespace ECanopy.DTO
{
    public class PendingRoleRequestDto
    {
        public string UserEmail { get; set; } = null!;
        public string UserName { get; set; } = null!;
        public string RequestedRole { get; set; } = null!;
        public DateTime RequestedAt { get; set; }
    }
}
