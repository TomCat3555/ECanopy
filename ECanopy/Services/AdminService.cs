using ECanopy.Data;
using ECanopy.Models;
using ECanopy.Common;
using ECanopy.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ECanopy.Services
{
    public class AdminService : IAdminService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public AdminService(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<object> GetPendingRoleRequestsAsync()
        {
            var requests = await _context.RoleRequests
                .Include(r => r.User)
                .Where(r => r.Status == "Pending")
                .ToListAsync();

            return new
            {
                count = requests.Count,
                data = requests
            };
        }

        public async Task ApproveRoleRequestAsync(int id, string adminId)
        {
            var request = await _context.RoleRequests.FindAsync(id)
                ?? throw new NotFoundException("Role request not found");

            if (request.Status != "Pending")
                throw new BusinessException("Request already processed");

            if (request.RequestedRole == "RWA_President")
            {
                bool exists = await _context.RwaMembers.AnyAsync(r =>
                    r.SocietyId == request.SocietyId &&
                    r.Role == "RWA_President" &&
                    r.IsActive);

                if (exists)
                    throw new BusinessException("President already exists");
            }

            var user = await _userManager.FindByIdAsync(request.UserId)
                ?? throw new NotFoundException("User not found");

            if (!await _userManager.IsInRoleAsync(user, request.RequestedRole))
                await _userManager.AddToRoleAsync(user, request.RequestedRole);

            var rwaMember = await _context.RwaMembers
                .FirstOrDefaultAsync(r =>
                    r.UserId == user.Id &&
                    r.SocietyId == request.SocietyId);

            if (rwaMember == null)
            {
                _context.RwaMembers.Add(new RwaMember
                {
                    UserId = user.Id,
                    SocietyId = request.SocietyId,
                    Role = request.RequestedRole,
                    IsActive = true
                });
            }
            else
            {
                rwaMember.Role = request.RequestedRole;
                rwaMember.IsActive = true;
            }

            request.Status = "Approved";
            request.ReviewedByUserId = adminId;
            request.ReviewedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }

        public async Task RejectRoleRequestAsync(int id, string adminId)
        {
            var request = await _context.RoleRequests.FindAsync(id)
                ?? throw new NotFoundException("Role request not found");

            if (request.Status != "Pending")
                throw new BusinessException("Already processed");

            request.Status = "Rejected";
            request.ReviewedByUserId = adminId;
            request.ReviewedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }
    }

}
