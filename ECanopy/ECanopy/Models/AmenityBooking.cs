using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

//Soumya Prasad Sahu - Part-G Amenities Booking

namespace ECanopy.Models
{
    public class AmenityBooking
    {
        [Key]
        public int AmenityBookingId { get; set; }

        public int AmenityId { get; set; }

        [ForeignKey(nameof(AmenityId))]
        public Amenity Amenity { get; set; } = null!;

        public int ResidentId { get; set; }

        [ForeignKey(nameof(ResidentId))]
        public Resident Resident { get; set; } = null!;

        public DateTime BookingDate { get; set; }

        public TimeSpan StartTime { get; set; }

        public TimeSpan EndTime { get; set; }

        public int NumberOfGuests { get; set; }

        public string Status { get; set; } = "Pending";

        public DateTime RequestedAt { get; set; } = DateTime.UtcNow;

        public DateTime? ApprovedAt { get; set; }

        public string? ApprovedByUserId { get; set; }

        [ForeignKey(nameof(ApprovedByUserId))]
        public ApplicationUser? ApprovedByUser { get; set; }

        public string? Notes { get; set; }
    }
}

