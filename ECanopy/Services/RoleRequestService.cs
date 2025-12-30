using ECanopy.Common;
using ECanopy.Data;
using ECanopy.Models;
using ECanopy.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ECanopy.Services
{
    public class RoleRequestService: IRoleRequestService
    {
        private readonly ApplicationDbContext _context;

        public RoleRequestService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task CreateAsync(string userId, string role, int societyId)
        {
            bool pending = await _context.RoleRequests.AnyAsync(r =>
                r.UserId == userId && r.Status == "Pending");

            if (pending)
                throw new BusinessException("Role request already pending");

            var request = new RoleRequest
            {
                UserId = userId,
                RequestedRole = role,
                SocietyId = societyId,
                Status = "Pending",
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
