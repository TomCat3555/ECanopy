namespace ECanopy.DTO
{
    public class AmenityBookingResponseDto
    {
        public int AmenityBookingId { get; set; }
        public int AmenityId { get; set; }
        public string AmenityName { get; set; } = null!;
        public int ResidentId { get; set; }
        public string ResidentName { get; set; } = null!;
        public DateTime BookingDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int NumberOfGuests { get; set; }
        public string Status { get; set; } = null!;
        public DateTime RequestedAt { get; set; }
        public DateTime? ApprovedAt { get; set; }
        public string? Notes { get; set; }
    }
}

