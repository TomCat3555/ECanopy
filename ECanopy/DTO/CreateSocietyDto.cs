using System.ComponentModel.DataAnnotations;

namespace ECanopy.DTO
{
    public class CreateSocietyDto
    {
        [Required]
        public string SocietyName { get; set; } = null!;
        [Required]
        public string Address { get; set; } = null!;
    }
}
