namespace ECanopy.DTO
{
    public class MaintainanceBillResponseDto
    {
        public decimal Amount { get; set; }
        public DateTime DueDate { get; set; }
        public bool IsPaid { get; set; }

    }
}
