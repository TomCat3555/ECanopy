using ECanopy.DTO;

namespace ECanopy.Services.Interfaces
{
    public interface IResidentJoinRequestService
    {
        Task CreateAsync(string userId, ResidentJoinRequestDto dto);

    }
}
