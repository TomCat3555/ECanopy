using ECanopy.Common;
using ECanopy.Data;
using ECanopy.Models;
using ECanopy.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ECanopy.Services
{
    public class RwaResidentApprovalService : IRwaResidentApprovalService
    {
        private readonly ApplicationDbContext _context;

        public RwaResidentApprovalService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ResidentJoinRequest>> GetPendingAsync(int societyId)
        {
            return await _context.ResidentJoinRequests
                .Where(r =>
                    r.Status == "Pending" &&
                    r.Flat.Building.SocietyId == societyId)
                .ToListAsync();
        }

        public async Task ApproveAsync(int requestId)
        {
            var request = await _context.ResidentJoinRequests
                .FirstOrDefaultAsync(r => r.ResidentJoinRequestId == requestId)
                ?? throw new NotFoundException("Request not found");

            request.Status = "Approved";
            await _context.SaveChangesAsync();
        }

        public async Task RejectAsync(int requestId)
        {
            var request = await _context.ResidentJoinRequests
                .FirstOrDefaultAsync(r => r.ResidentJoinRequestId == requestId)
                ?? throw new NotFoundException("Request not found");

            request.Status = "Rejected";
            await _context.SaveChangesAsync();
        }
    }
}
