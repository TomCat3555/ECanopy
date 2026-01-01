using ECanopy.DTO;

namespace ECanopy.Services.Interfaces
{
    public interface IFlatService
    {
        Task<FlatResponseDto> CreateAsync(int societyId, CreateFlatDto dto);

    }
}
