using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECanopy.Models
{
    public class Complaint
    {
        [Key]
        public int ComplaintId { get; set; }

        [Required]
        [MaxLength(50)]
        public string TicketNumber { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Category { get; set; } = string.Empty;

        [Required]
        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;

        [MaxLength(20)]
        public string Priority { get; set; } = "Medium";

        [MaxLength(20)]
        public string Status { get; set; } = "Open";

        // Optional contact information
        [MaxLength(100)]
        public string? ContactName { get; set; }

        [MaxLength(15)]
        public string? ContactPhone { get; set; }

        [MaxLength(100)]
        public string? ContactEmail { get; set; }

        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedOn { get; set; }

        // For admin assignment (optional)
        public int? AssignedTo { get; set; }

        // Navigation properties
        public ICollection<ComplaintComments> Comments { get; set; } = new List<ComplaintComments>();
        public ICollection<ComplaintAttachment> Attachments { get; set; } = new List<ComplaintAttachment>();
    }
}
