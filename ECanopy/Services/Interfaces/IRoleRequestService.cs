using ECanopy.Models;

namespace ECanopy.Services.Interfaces
{
    public interface IRoleRequestService
    {
        Task CreateAsync(string userId, string role, int societyId);
        Task<IEnumerable<RoleRequest>> GetMyAsync(string userId);
    }
}
