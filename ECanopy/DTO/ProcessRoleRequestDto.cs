using System.ComponentModel.DataAnnotations;

namespace ECanopy.DTO
{
    public class ProcessRoleRequestDto
    {
        [Required]
        public string UserEmail { get; set; } = null!;

    }
}
