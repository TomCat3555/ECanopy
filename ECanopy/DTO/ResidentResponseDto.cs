namespace ECanopy.DTO
{
    public class ResidentResponseDto
    {
        public string FullName { get; set; } = null!;
        public string FlatNumber { get; set; }
        public string BuildingName { get; set; }
        public bool IsOwner { get; set; }
    }
}
