using System.ComponentModel.DataAnnotations;

namespace ECanopy.DTO
{
    public class CreateNoticeDto
    {
        [Required]
        public string Title { get; set; } = null!;
        [Required]
        public string Message { get; set; } = null!;
    }
}
