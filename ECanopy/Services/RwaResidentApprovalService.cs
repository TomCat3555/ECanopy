using ECanopy.Common;
using ECanopy.Data;
using ECanopy.DTO;
using ECanopy.Models;
using Microsoft.EntityFrameworkCore;

namespace ECanopy.Services
{
    public interface IRwaResidentApprovalService
    {
        Task<IEnumerable<PendingResidentJoinRequestDto>> GetPendingAsync(int societyId);
        Task ApproveAsync(int societyId, string userEmail);
        Task RejectAsync(int societyId, string userEmail);
    }
    public class RwaResidentApprovalService : IRwaResidentApprovalService
    {
        private readonly ApplicationDbContext _context;
        private readonly IResidentOnboardingService _onboardingService;

        public RwaResidentApprovalService(ApplicationDbContext context, IResidentOnboardingService onboardingService)
        {
            _context = context;
            _onboardingService = onboardingService;
        }

        public async Task<IEnumerable<PendingResidentJoinRequestDto>> GetPendingAsync(int societyId)
        {
            return await _context.ResidentJoinRequests
                .Include(r => r.User)
                .Include(r => r.Flat)
                    .ThenInclude(f => f.Building)
                .Where(r =>
                    r.Status == "Pending" &&
                    r.Flat.Building.SocietyId == societyId)
                .Select(r => new PendingResidentJoinRequestDto
                {
                    UserName = r.User.FullName,
                    BuildingName = r.Flat.Building.BuildingName,
                    FlatNumber = r.Flat.FlatNumber
                })
                .ToListAsync();
        }

        public async Task ApproveAsync(int societyId, string userEmail)
        {
            var request = await _context.ResidentJoinRequests
                .Include(r => r.User)
                .Include(r => r.Flat)
                    .ThenInclude(f => f.Building)
                .FirstOrDefaultAsync(r =>
                    r.User.Email == userEmail &&
                    r.Status == "Pending");

            if (request == null)
                throw new NotFoundException("Join request not found");

            if (request.Flat.Building.SocietyId != societyId)
                throw new ForbiddenException("Unauthorized approval");

            await _onboardingService.OnboardAsync(request,request.User.FullName);
        }

        public async Task RejectAsync(int societyId, string userEmail)
        {
            var request = await _context.ResidentJoinRequests
                .Include(r => r.User)
                .Include(r => r.Flat)
                    .ThenInclude(f => f.Building)
                .FirstOrDefaultAsync(r =>
                    r.User.Email == userEmail &&
                    r.Status == "Pending");

            if (request == null)
                throw new NotFoundException("Join request not found");

            if (request.Flat.Building.SocietyId != societyId)
                throw new ForbiddenException("Unauthorized rejection");

            request.Status = "Rejected";
            await _context.SaveChangesAsync();
        }

    }
}
