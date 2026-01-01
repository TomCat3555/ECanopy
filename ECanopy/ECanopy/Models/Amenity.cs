using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

//Soumya Prasad Sahu - Part-G Amenities Booking

namespace ECanopy.Models
{
    public class Amenity
    {
        [Key]
        public int AmenityId { get; set; }

        [Required]
        public string AmenityName { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public int Capacity { get; set; }

        public string Rules { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;

        public int SocietyId { get; set; }

        [ForeignKey(nameof(SocietyId))]
        public Society Society { get; set; } = null!;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<AmenityBooking> Bookings { get; set; } = new List<AmenityBooking>();
    }
}

