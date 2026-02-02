using ECanopy.Common;
using ECanopy.Data;
using ECanopy.Models;
using Microsoft.EntityFrameworkCore;

namespace ECanopy.Services
{
    public interface IOwnershipRequestService
    {
        Task RequestOwnershipAsync(string residentEmail);
        Task ApproveAsync(int requestId, string rwaEmail);
        Task RejectAsync(int requestId, string rwaEmail);
    }
    public class OwnershipRequestService : IOwnershipRequestService
    {
        private readonly ApplicationDbContext _context;

        public OwnershipRequestService(ApplicationDbContext context)
        {
            _context = context;
        }

        // ===============================
        // RESIDENT REQUESTS OWNERSHIP
        // ===============================
        public async Task RequestOwnershipAsync(string residentEmail)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == residentEmail)
                ?? throw new BusinessException("User not found");

            var resident = await _context.Residents
                .FirstOrDefaultAsync(r => r.UserId == user.Id)
                ?? throw new BusinessException("Resident profile not found");

            if (resident.IsOwner)
                throw new BusinessException("Already owner");

            bool flatHasOwner = await _context.Residents
                .AnyAsync(r => r.FlatId == resident.FlatId && r.IsOwner);

            if (flatHasOwner)
                throw new BusinessException("Flat already has an owner");

            bool alreadyRequested = await _context.OwnershipRequests
                .AnyAsync(o =>
                    o.ResidentId == resident.ResidentId &&
                    o.Status == "Pending");

            if (alreadyRequested)
                throw new BusinessException("Ownership request already pending");

            var request = new OwnershipRequest
            {
                ResidentId = resident.ResidentId,
                FlatId = resident.FlatId,
                Status = "Pending",
                RequestedAt = DateTime.UtcNow
            };

            _context.OwnershipRequests.Add(request);
            await _context.SaveChangesAsync();
        }

        // ===============================
        // RWA APPROVES OWNERSHIP
        // ===============================
        public async Task ApproveAsync(int requestId, string rwaEmail)
        {
            using var tx = await _context.Database.BeginTransactionAsync();

            var rwaUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == rwaEmail)
                ?? throw new BusinessException("User not found");

            var rwa = await _context.RwaMembers
                .FirstOrDefaultAsync(r => r.UserId == rwaUser.Id && r.IsActive)
                ?? throw new ForbiddenException("Not authorized");

            if (rwa.Role != "RWA_President" &&
                rwa.Role != "RWA_Secretary")
                throw new ForbiddenException("Not authorized");

            var request = await _context.OwnershipRequests
                .Include(o => o.Resident)
                .ThenInclude(r => r.Flat)
                .ThenInclude(f => f.Building)
                .FirstOrDefaultAsync(o => o.OwnershipRequestId == requestId)
                ?? throw new BusinessException("Request not found");

            // Ensure RWA belongs to same society
            if (request.Resident.Flat.Building.SocietyId != rwa.SocietyId)
                throw new ForbiddenException("Cannot approve request from another society");

            if (request.Status != "Pending")
                throw new BusinessException("Ownership request already processed");

            bool flatHasOwner = await _context.Residents
                .AnyAsync(r =>
                    r.FlatId == request.FlatId &&
                    r.IsOwner);

            if (flatHasOwner)
                throw new BusinessException("Flat already has an owner");

            request.Resident.IsOwner = true;
            request.Status = "Approved";
            request.ReviewedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            await tx.CommitAsync();
        }

        // ===============================
        // RWA REJECTS OWNERSHIP
        // ===============================
        public async Task RejectAsync(int requestId, string rwaEmail)
        {
            var rwaUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == rwaEmail)
                ?? throw new BusinessException("User not found");

            var rwa = await _context.RwaMembers
                .FirstOrDefaultAsync(r => r.UserId == rwaUser.Id && r.IsActive)
                ?? throw new ForbiddenException("Not authorized");

            if (rwa.Role != "RWA_President" &&
                rwa.Role != "RWA_Secretary")
                throw new ForbiddenException("Not authorized");

            var request = await _context.OwnershipRequests
                .FirstOrDefaultAsync(o => o.OwnershipRequestId == requestId)
                ?? throw new BusinessException("Request not found");

            if (request.Status != "Pending")
                throw new BusinessException("Ownership request already processed");

            request.Status = "Rejected";
            request.ReviewedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }

    }
}
