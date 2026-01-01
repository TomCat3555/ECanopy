using ECanopy.DTO;

namespace ECanopy.Services.Interfaces
{
    public interface IAmenityBookingService
    {
        Task<AmenityBookingResponseDto> CreateAsync(string userId, CreateAmenityBookingDto dto);
        Task<IEnumerable<AmenityBookingResponseDto>> GetMyBookingsAsync(string userId);
        Task<IEnumerable<AmenityBookingResponseDto>> GetPendingBookingsAsync(int societyId);
        Task<IEnumerable<AmenityBookingResponseDto>> GetAllBookingsAsync(int societyId);
        Task ApproveAsync(int bookingId, string approvedByUserId);
        Task RejectAsync(int bookingId, string approvedByUserId);
        Task<IEnumerable<TimeSpan>> GetAvailableTimeSlotsAsync(int amenityId, DateTime date);
    }
}

