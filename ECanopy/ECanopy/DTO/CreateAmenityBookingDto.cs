namespace ECanopy.DTO
{
    public class CreateAmenityBookingDto
    {
        public int AmenityId { get; set; }
        public DateTime BookingDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int NumberOfGuests { get; set; }
        public string? Notes { get; set; }
    }
}

