using ECanopy.DTO;

namespace ECanopy.Services.Interfaces
{
    public interface IMaintainanceBillService
    {
        Task<MaintainanceBillResponseDto> CreateAsync(int societyId, CreateMaintainanceBillDto dto);
        Task<IEnumerable<MaintainanceBillResponseDto>> GetMyAsync(string userId);
        Task<IEnumerable<MaintainanceBillResponseDto>> GetAllAsync(int societyId);
    }
}
