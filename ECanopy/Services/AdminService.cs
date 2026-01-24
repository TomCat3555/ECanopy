using ECanopy.Common;
using ECanopy.Data;
using ECanopy.DTO;
using ECanopy.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ECanopy.Services
{
    public interface IAdminService
    {
        Task<List<PendingRoleRequestDto>> GetPendingRoleRequestsAsync();
        Task ApproveRoleRequestAsync(string userEmail);
        Task RejectRoleRequestAsync(string userEmail);
    }
    public class AdminService : IAdminService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        private static readonly HashSet<string> AllowedRwaRoles =
            new()
            {
                "RWA_President",
                "RWA_Secretary",
                "RWA_Treasurer"
            };

        public AdminService(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // ===============================
        // VIEW PENDING ROLE REQUESTS
        // ===============================
        public async Task<List<PendingRoleRequestDto>> GetPendingRoleRequestsAsync()
        {
            return await _context.RoleRequests
                .Include(r => r.User)
                .Where(r => r.Status == "Pending")
                .OrderBy(r => r.RequestedAt)
                .Select(r => new PendingRoleRequestDto
                {
                    UserEmail = r.User.Email!,
                    UserName = r.User.FullName,
                    RequestedRole = r.RequestedRole,
                    RequestedAt = r.RequestedAt
                })
                .ToListAsync();
        }

        // ===============================
        // APPROVE ROLE REQUEST (NO IDS)
        // ===============================
        public async Task ApproveRoleRequestAsync(string userEmail)
        {
            var user = await _userManager.FindByEmailAsync(userEmail)
                ?? throw new NotFoundException("User not found");

            var request = await _context.RoleRequests
                .Where(r =>
                    r.UserId == user.Id &&
                    r.Status == "Pending")
                .OrderBy(r => r.RequestedAt)
                .FirstOrDefaultAsync()
                ?? throw new NotFoundException("No pending role request");

            if (!AllowedRwaRoles.Contains(request.RequestedRole))
                throw new BusinessException("Invalid RWA role requested");

            bool alreadyRwa = await _context.RwaMembers
                .AnyAsync(r => r.UserId == user.Id && r.IsActive);

            if (alreadyRwa)
                throw new BusinessException("User is already an RWA member");

            // Assign Identity role
            if (!await _userManager.IsInRoleAsync(user, request.RequestedRole))
            {
                await _userManager.AddToRoleAsync(user, request.RequestedRole);
            }

            // Create RWA membership (society assigned later)
            _context.RwaMembers.Add(new RwaMember
            {
                UserId = user.Id,
                Role = request.RequestedRole,
                SocietyId = null,
                IsActive = true
            });

            request.Status = "Approved";

            await _context.SaveChangesAsync();
        }

        // ===============================
        // REJECT ROLE REQUEST (NO IDS)
        // ===============================
        public async Task RejectRoleRequestAsync(string userEmail)
        {
            var user = await _userManager.FindByEmailAsync(userEmail)
                ?? throw new NotFoundException("User not found");

            var request = await _context.RoleRequests
                .Where(r =>
                    r.UserId == user.Id &&
                    r.Status == "Pending")
                .OrderBy(r => r.RequestedAt)
                .FirstOrDefaultAsync()
                ?? throw new NotFoundException("No pending role request");

            request.Status = "Rejected";

            await _context.SaveChangesAsync();
        }
    }

}
