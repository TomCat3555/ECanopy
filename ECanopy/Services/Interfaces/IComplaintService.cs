using ECanopy.DTO;

namespace ECanopy.Services.Interfaces
{
    public interface IComplaintService
    {
        Task RaiseAsync(string userId, CreateComplaintDto dto);
        Task<IEnumerable<ComplaintResponseDto>> GetSocietyComplaintsAsync(int societyId);
        Task<IEnumerable<ComplaintResponseDto>> GetSocietyAsync(int societyId);
    }
}
