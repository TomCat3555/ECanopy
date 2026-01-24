namespace ECanopy.DTO
{
    public class PendingResidentJoinRequestDto
    {

        public int RequestId { get; set; }

        public string UserEmail { get; set; } = null!;
        public string UserName { get; set; } = null!;
        public string FlatNumber { get; set; } = null!;
        public string BuildingName { get; set; } = null!;
    }
}
