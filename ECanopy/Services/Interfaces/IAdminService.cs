namespace ECanopy.Services.Interfaces
{
    public interface IAdminService
    {
        Task<object> GetPendingRoleRequestsAsync();
        Task ApproveRoleRequestAsync(int requestId, string adminUserId);
        Task RejectRoleRequestAsync(int requestId, string adminUserId);
    }
}
