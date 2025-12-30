namespace ECanopy.DTO
{
    public class CreateMaintainanceBillDto
    {
        public decimal Amount { get; set; }
        public DateTime DueDate { get; set; }
        public string BuildingName { get; set; }
        public string FlatNumber { get; set; }
    }
}
