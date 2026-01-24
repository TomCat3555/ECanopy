using ECanopy.Common;
using ECanopy.Data;
using ECanopy.DTO;
using ECanopy.Models;
using Microsoft.EntityFrameworkCore;

namespace ECanopy.Services
{
    public interface IRoleRequestService
    {
        Task CreateAsync(string userId, RoleRequestDto dto);
        Task<IEnumerable<RoleRequest>> GetMyAsync(string userId);
    }
    public class RoleRequestService: IRoleRequestService
    {
        private readonly ApplicationDbContext _context;

        public RoleRequestService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task CreateAsync(string userId, RoleRequestDto dto)
        {
            bool hasPending = await _context.RoleRequests.AnyAsync(r =>
                r.UserId == userId && r.Status == "Pending");

            if (hasPending)
                throw new BusinessException("Role request already pending");

            bool alreadyRwa = await _context.RwaMembers.AnyAsync(r =>
                r.UserId == userId && r.IsActive);

            if (alreadyRwa)
                throw new BusinessException("User is already an RWA member");

            var request = new RoleRequest
            {
                UserId = userId,
                Status = "Pending",
                RequestedRole=dto.RequestedRole,
                RequestedAt = DateTime.UtcNow
            };

            _context.RoleRequests.Add(request);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<RoleRequest>> GetMyAsync(string userId)
        {
            return await _context.RoleRequests
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.RequestedAt)
                .ToListAsync();
        }

    }
}
