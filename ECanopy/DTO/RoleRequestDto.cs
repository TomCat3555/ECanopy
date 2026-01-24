using System.ComponentModel.DataAnnotations;

namespace ECanopy.DTO
{
    public class RoleRequestDto
    {
        [Required]
        public string RequestedRole { get; set; } = null!;
    }
}
