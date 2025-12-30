namespace ECanopy.DTO
{
    public class CreatePaymentDto
    {
        public int MaintainanceBillId { get; set; }
        public string PaymentType { get; set; } = null!;
    }
}
