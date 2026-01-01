using System.ComponentModel.DataAnnotations;

namespace ECanopy.Models
{
    public class Society
    {
        [Key]
        public int SocietyId { get; set; }

        [Required]
        [RegularExpression(@"^[a-zA-Z0-9\s]{3,100}$", ErrorMessage = "Society name must be 3–100 characters")]
        public string SocietyName { get; set; }

        [RegularExpression(@"^[a-zA-Z0-9\s,.-]{0,300}$",ErrorMessage = "Invalid society description")]
        public string SocietyDescription { get; set; }

        [RegularExpression(@"^[a-zA-Z ]{3,50}$",
        ErrorMessage = "Owner name is invalid")]
        public string Owner { get; set; }

        [RegularExpression(@"^[a-zA-Z0-9\s,.-]{5,200}$",
        ErrorMessage = "Invalid address format")]
        public string Address { get; set; }
        public ICollection<Building> Buildings { get; set; }


    }
}
