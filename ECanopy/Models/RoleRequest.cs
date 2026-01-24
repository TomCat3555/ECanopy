using System.ComponentModel.DataAnnotations;

namespace ECanopy.Models
{
    public class RoleRequest
    {
        public int RoleRequestId { get; set; }

        [Required]
        public string UserId { get; set; } = null!;
        public ApplicationUser User { get; set; } = null!;

        [Required]
        [MaxLength(50)]
        public string RequestedRole { get; set; } = null!;

        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "Pending";

        [Required]
        public DateTime RequestedAt { get; set; } = DateTime.UtcNow;

    }
}
