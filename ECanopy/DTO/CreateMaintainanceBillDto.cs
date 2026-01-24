using System.ComponentModel.DataAnnotations;

namespace ECanopy.DTO
{
    public class CreateMaintainanceBillDto
    {
        public decimal Amount { get; set; }
        [Required]
        public DateTime DueDate { get; set; }
        [Required]
        public string BuildingName { get; set; } = null!;
        [Required]
        public string FlatNumber { get; set; } = null!;
    }
}
