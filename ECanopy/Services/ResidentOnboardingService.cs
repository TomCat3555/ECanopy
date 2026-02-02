
using ECanopy.Common;
using ECanopy.Data;
using ECanopy.DTO;
using ECanopy.Models;
using Microsoft.EntityFrameworkCore;

namespace ECanopy.Services
{
    public interface IResidentOnboardingService
    {
        Task<ResidentResponseDto> OnboardAsync(ResidentJoinRequest request,string fullName);

    }
    public class ResidentOnboardingService : IResidentOnboardingService
    {
        private readonly ApplicationDbContext _context;

        public ResidentOnboardingService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ResidentResponseDto> OnboardAsync(ResidentJoinRequest request , string fullName)
        {
            bool alreadyResident = await _context.Residents
                .AnyAsync(r => r.UserId == request.UserId);

            if (alreadyResident)
                throw new BusinessException("User is already a resident");

            var flat = await _context.Flats
                .Include(f => f.Building)
                .ThenInclude(b => b.Society)
                .FirstOrDefaultAsync(f => f.FlatId == request.FlatId);

            if (flat == null)
                throw new BusinessException("Flat no longer exists");

            int currentResidentCount = await _context.Residents
                .CountAsync(r => r.FlatId == flat.FlatId);

            if (currentResidentCount >= flat.MaxResident)
                throw new BusinessException("Flat has reached maximum resident capacity");

            var resident = new Resident
            {
                FullName = fullName,
                UserId = request.UserId,
                FlatId = request.FlatId,
                IsOwner = false
            };

            _context.Residents.Add(resident);

            flat.IsOccupied = true;

            request.Status = "Approved";

            await _context.SaveChangesAsync();

            return new ResidentResponseDto
            {
                BuildingName = flat.Building.BuildingName,
                FlatNumber = flat.FlatNumber,
                IsOwner = resident.IsOwner
            };
        }

    }

}
