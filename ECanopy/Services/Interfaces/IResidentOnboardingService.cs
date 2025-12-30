using ECanopy.DTO;

namespace ECanopy.Services.Interfaces
{
    public interface IResidentOnboardingService
    {
        Task<ResidentResponseDto> CreateAsync(string userId,CreateResidentDto dto);

    }
}
