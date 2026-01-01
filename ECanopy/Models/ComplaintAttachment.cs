using System.ComponentModel.DataAnnotations;

namespace ECanopy.Models
{
    public class ComplaintAttachment
    {
        [Key]
        public int AttachmentId { get; set; }

        public int ComplaintId { get; set; }
        public Complaint? Complaint { get; set; }

        [Required]
        [MaxLength(255)]
        public string FileName { get; set; } = string.Empty;

        [Required]
        [MaxLength(500)]
        public string FilePath { get; set; } = string.Empty;

        [MaxLength(50)]
        public string? FileType { get; set; } // image/jpeg, video/mp4, etc.

        public long FileSize { get; set; } // in bytes

        public DateTime UploadedOn { get; set; } = DateTime.UtcNow;
    }
}
