using ECanopy.DTO;

namespace ECanopy.Services.Interfaces
{
    public interface IBuildingService
    {
        Task<BuildingResponseDto> CreateAsync(int societyId, CreateBuildingDto dto);

    }

}
