using System.ComponentModel.DataAnnotations;

namespace ECanopy.Models
{
    public class Society
    {
        [Key]
        public int SocietyId { get; set; }
        [Required]
        public string SocietyName { get; set; } = string.Empty;
        public string SocietyDescription { get; set; } = string.Empty;
        public string Owner { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public ICollection<Building> Buildings { get; set; } = new List<Building>();
//-----------------------------------------------------------------------------------------
//Soumya Prasad Sahu - Part-G Amenities Booking
        public ICollection<Amenity> Amenities { get; set; } = new List<Amenity>();
//-----------------------------------------------------------------------------------------

    }
}
