using System.ComponentModel.DataAnnotations;

namespace ECanopy.DTO
{
    public class CreateRoleRequestDto
    {
        [Required]
        public string RequestedRole { get; set; } = null!;
    }
}
