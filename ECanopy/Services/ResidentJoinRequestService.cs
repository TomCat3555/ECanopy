using ECanopy.Common;
using ECanopy.Data;
using ECanopy.DTO;
using ECanopy.Models;
using Microsoft.EntityFrameworkCore;

namespace ECanopy.Services
{

    public interface IResidentJoinRequestService
    {
        Task CreateAsync(string userId, ResidentJoinRequestDto dto);

    } 
    public class ResidentJoinRequestService : IResidentJoinRequestService
    {
        private readonly ApplicationDbContext _context;

        public ResidentJoinRequestService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task CreateAsync(string userId, ResidentJoinRequestDto dto)
        {
            // 1. Enforce 1 user → 1 resident
            bool alreadyResident = await _context.Residents
                .AnyAsync(r => r.UserId == userId);

            if (alreadyResident)
                throw new BusinessException("User already belongs to a society");

            // 2. Only one pending request allowed
            bool pendingExists = await _context.ResidentJoinRequests
                .AnyAsync(r => r.UserId == userId && r.Status == "Pending");

            if (pendingExists)
                throw new BusinessException("Join request already pending");

            // 3. Resolve flat by BuildingName + FlatNumber (scoped correctly)
            var flat = await _context.Flats
                .Include(f => f.Building)
                    .ThenInclude(b => b.Society)
                .Include(f => f.Residents)
                .FirstOrDefaultAsync(f =>
                    f.FlatNumber == dto.FlatNumber &&
                    f.Building.BuildingName == dto.BuildingName);

            if (flat == null)
                throw new NotFoundException("Flat not found");

            // 4. Enforce flat capacity
            if (flat.Residents.Count >= flat.MaxResident)
                throw new BusinessException("Flat has reached maximum residents");

            // 5. Create join request
            var request = new ResidentJoinRequest
            {
                UserId = userId,
                FlatId = flat.FlatId,
                Status = "Pending"
            };

            _context.ResidentJoinRequests.Add(request);
            await _context.SaveChangesAsync();
        }

    }

}
