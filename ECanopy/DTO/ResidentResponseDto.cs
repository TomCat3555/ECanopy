namespace ECanopy.DTO
{
    public class ResidentResponseDto
    {
        public string FullName { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;
        public bool IsOwner { get; set; }
    }
}
