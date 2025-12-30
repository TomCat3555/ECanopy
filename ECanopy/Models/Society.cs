using System.ComponentModel.DataAnnotations;

namespace ECanopy.Models
{
    public class Society
    {
        [Key]
        public int SocietyId { get; set; }
        [Required]
        public string SocietyName { get; set; }
        public string SocietyDescription { get; set; }
        public string Owner { get; set; }
        public string Address { get; set; }
        public ICollection<Building> Buildings { get; set; }


    }
}
