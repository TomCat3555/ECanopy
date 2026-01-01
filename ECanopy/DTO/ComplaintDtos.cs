using System.ComponentModel.DataAnnotations;

namespace ECanopy.DTO
{
    public class ComplaintDtos
    {
        public class CreateComplaintDto
        {
            [Required]
            public string Category { get; set; } = string.Empty;

            [Required]
            public string Description { get; set; } = string.Empty;

            public string Priority { get; set; } = "Medium";
            public string? ContactName { get; set; }
            public string? ContactPhone { get; set; }
            public string? ContactEmail { get; set; }
        }

        public class ComplaintResponseDto
        {
            public int ComplaintId { get; set; }
            public string TicketNumber { get; set; } = string.Empty;
            public string Category { get; set; } = string.Empty;
            public string Description { get; set; } = string.Empty;
            public string Priority { get; set; } = string.Empty;
            public string Status { get; set; } = string.Empty;
            public string? ContactName { get; set; }
            public DateTime CreatedOn { get; set; }
            public DateTime? UpdatedOn { get; set; }
            public List<CommentDto> Comments { get; set; } = new();
            public List<AttachmentDto> Attachments { get; set; } = new();
        }

        public class CommentDto
        {
            public int CommentId { get; set; }
            public string CommentText { get; set; } = string.Empty;
            public string? CommentedBy { get; set; }
            public DateTime CommentedOn { get; set; }
        }

        public class AttachmentDto
        {
            public int AttachmentId { get; set; }
            public string FileName { get; set; } = string.Empty;
            public string FilePath { get; set; } = string.Empty;
            public string? FileType { get; set; }
            public long FileSize { get; set; }
        }

        public class AddCommentDto
        {
            [Required]
            public string CommentText { get; set; } = string.Empty;
            public string? CommentedBy { get; set; }
        }
    }
}
