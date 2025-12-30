namespace ECanopy.DTO
{
    public class PaymentResponseDto
    {
        public decimal Amount { get; set; }
        public DateTime PaymentDate { get; set; }
        public string PaymentType { get; set; } = null!;
    }
}
