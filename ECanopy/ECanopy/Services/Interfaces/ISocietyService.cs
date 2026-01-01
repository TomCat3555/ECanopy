using ECanopy.DTO;

namespace ECanopy.Services.Interfaces
{
    public interface ISocietyService
    {
        Task<SocietyResponseDto> CreateAsync(CreateSocietyDto dto);
        Task<IEnumerable<SocietyResponseDto>> GetAllAsync();
    }
}
