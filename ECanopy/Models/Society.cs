using System.ComponentModel.DataAnnotations;

namespace ECanopy.Models
{
    public class Society
    {
        [Key]
        public int SocietyId { get; set; }

        [Required]
        [RegularExpression(@"^[a-zA-Z0-9\s]{3,100}$", ErrorMessage = "Society name must be 3–100 characters")]
        public string SocietyName { get; set; } = null!;

        [RegularExpression(@"^[a-zA-Z0-9\s,.-]{0,300}$",ErrorMessage = "Invalid society description")]
        public string? SocietyDescription { get; set; }

        [Required]
        public Address Address { get; set; } = null!;
        public ICollection<Building> Buildings { get; set; } = new List<Building>();

    }
}
