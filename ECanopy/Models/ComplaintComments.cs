using System.ComponentModel.DataAnnotations;

namespace ECanopy.Models
{
    public class ComplaintComments
    {
        [Key]
        public int CommentId { get; set; }

        public int ComplaintId { get; set; }
        public Complaint? Complaint { get; set; }

        [Required]
        [MaxLength(500)]
        public string CommentText { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? CommentedBy { get; set; } // Can be admin name or "Anonymous"

        public DateTime CommentedOn { get; set; } = DateTime.UtcNow;
    }
}
