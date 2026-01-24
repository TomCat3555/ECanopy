using System.ComponentModel.DataAnnotations;

namespace ECanopy.DTO
{
    public class ProcessResidentJoinRequestDto
    {
        [Required]
        public string UserEmail { get; set; } = null!;
    }
}
