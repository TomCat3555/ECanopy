namespace ECanopy.DTO
{
    public class AmenityResponseDto
    {
        public int AmenityId { get; set; }
        public string AmenityName { get; set; } = null!;
        public string Description { get; set; }
        public int Capacity { get; set; }
        public string Rules { get; set; }
        public bool IsActive { get; set; }
        public int SocietyId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

