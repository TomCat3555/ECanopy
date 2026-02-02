using ECanopy.Models;
using System.ComponentModel.DataAnnotations;

namespace ECanopy.DTO
{
    public class CreateSocietyDto
    {
        [Required]
        public string SocietyName { get; set; } = null!;
        
        [Required]
        public string? SocietyDescription { get; set; } = null!;
        
        [Required]
        public Address Address { get; set; } = null!;
    }
}
