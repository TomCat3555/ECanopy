using System.ComponentModel.DataAnnotations;

namespace ECanopy.DTO
{
    public class CreateResidentDto
    {
        [Required]
        public string SocietyName { get; set; } = null!;
        [Required]
        public string BuildingName { get; set; } = null!;
        [Required]
        public string FlatNumber { get; set; } = null!;
        public bool IsOwner { get; set; }
    }
}
