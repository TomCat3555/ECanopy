using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECanopy.Models
{
    public class OwnershipRequest
    {
        [Key]
        public int OwnershipRequestId { get; set; }

        [Required]
        public int ResidentId { get; set; }

        [ForeignKey(nameof(ResidentId))]
        public Resident Resident { get; set; } = null!;

        [Required]
        public int FlatId { get; set; }

        [ForeignKey(nameof(FlatId))]
        public Flat Flat { get; set; } = null!;

        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "Pending";

        [Required]
        public DateTime RequestedAt { get; set; } = DateTime.UtcNow;

        public DateTime? ReviewedAt { get; set; }
    }
}
