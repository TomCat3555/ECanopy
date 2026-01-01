using ECanopy.DTO;

namespace ECanopy.Services.Interfaces
{
    public interface IPaymentService
    {
        Task<PaymentResponseDto> PayAsync(string userId, CreatePaymentDto dto);
        Task<IEnumerable<PaymentResponseDto>> MyAsync(string userId);
        Task<IEnumerable<PaymentResponseDto>> AllAsync(int societyId);
    }
}
