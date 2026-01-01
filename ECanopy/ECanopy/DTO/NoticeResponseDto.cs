namespace ECanopy.DTO
{
    public class NoticeResponseDto
    {
        public string Title { get; set; } = null!;
        public string Message { get; set; } = null!;
        public DateTime PublishedAt { get; set; }
    }
}
