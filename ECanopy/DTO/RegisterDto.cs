using System.ComponentModel.DataAnnotations;

namespace ECanopy.DTO
{
    public class RegisterDto
    {
        [Required]
        public string Email { get; set; } = null!;
        [Required]
        public string Password { get; set; } = null!;
        [Required]
        public string FullName { get; set; } = null!;
    }
}
