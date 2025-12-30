using ECanopy.Common;
using ECanopy.Data;
using ECanopy.DTO;
using ECanopy.Models;
using ECanopy.Services.Interfaces;

namespace ECanopy.Services
{
    public class ResidentOnboardingService : IResidentOnboardingService
    {
        private readonly ApplicationDbContext _context;

        public ResidentOnboardingService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ResidentResponseDto> CreateAsync(
            string userId,
            CreateResidentDto dto)
        {
            if (_context.Residents.Any(r => r.UserId == userId))
                throw new BusinessException("Resident already exists");

            var resident = new Resident
            {
                UserId = userId,
                //FlatId = dto.FlatId,
                IsOwner = dto.IsOwner
            };

            _context.Residents.Add(resident);
            await _context.SaveChangesAsync();

            return new ResidentResponseDto
            {
                //FlatId = resident.FlatId,
                IsOwner = resident.IsOwner
            };
        }
    }

}
