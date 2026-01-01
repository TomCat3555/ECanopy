using ECanopy.DTO;

namespace ECanopy.Services.Interfaces
{
    public interface IAmenityService
    {
        Task<AmenityResponseDto> CreateAsync(int societyId, CreateAmenityDto dto);
        Task<IEnumerable<AmenityResponseDto>> GetAllAsync(int societyId);
        Task<AmenityResponseDto> GetByIdAsync(int amenityId);
        Task<IEnumerable<AmenityResponseDto>> GetActiveAmenitiesAsync(int societyId);
    }
}

