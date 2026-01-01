namespace ECanopy.DTO
{
    public class CreateAmenityDto
    {
        public string AmenityName { get; set; } = null!;
        public string Description { get; set; }
        public int Capacity { get; set; }
        public string Rules { get; set; }
    }
}

