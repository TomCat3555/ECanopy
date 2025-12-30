using ECanopy.Models;

namespace ECanopy.Services.Interfaces
{
    public interface IRwaResidentApprovalService
    {
        Task<IEnumerable<ResidentJoinRequest>> GetPendingAsync(int societyId);
        Task ApproveAsync(int requestId);
        Task RejectAsync(int requestId);
    }
}
