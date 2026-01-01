namespace ECanopy.DTO
{
    public class ComplaintResponseDto
    {
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string Status { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
    }
}
