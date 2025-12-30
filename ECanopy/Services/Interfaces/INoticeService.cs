using ECanopy.DTO;
using ECanopy.Models;

namespace ECanopy.Services.Interfaces
{
    public interface INoticeService
    {
        Task CreateAsync(int societyId, CreateNoticeDto dto);
        Task<IEnumerable<Notice>> GetForResidentAsync(string userId);
    }
}
