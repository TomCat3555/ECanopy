namespace ECanopy.Models
{
    public class RoleRequest
    {
        public int RoleRequestId { get; set; }
        public string UserId { get; set; }
        public string RequestedRole { get; set; } 
        public int SocietyId { get; set; }
        public ApplicationUser User { get; set; }
        public string Status { get; set; } 
        public DateTime RequestedAt { get; set; }
        public DateTime? ReviewedAt { get; set; }

        public string ReviewedByUserId { get; set; }
    }
}
