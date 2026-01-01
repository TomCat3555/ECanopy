using ECanopy.Data;
using ECanopy.DTO;
using ECanopy.Models;
using ECanopy.Common;
using ECanopy.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ECanopy.Services
{
    public class AmenityService : IAmenityService
    {
        private readonly ApplicationDbContext _context;

        public AmenityService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<AmenityResponseDto> CreateAsync(int societyId, CreateAmenityDto dto)
        {
            var amenity = new Amenity
            {
                AmenityName = dto.AmenityName,
                Description = dto.Description,
                Capacity = dto.Capacity,
                Rules = dto.Rules,
                SocietyId = societyId,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.Amenities.Add(amenity);
            await _context.SaveChangesAsync();

            return new AmenityResponseDto
            {
                AmenityId = amenity.AmenityId,
                AmenityName = amenity.AmenityName,
                Description = amenity.Description,
                Capacity = amenity.Capacity,
                Rules = amenity.Rules,
                IsActive = amenity.IsActive,
                SocietyId = amenity.SocietyId,
                CreatedAt = amenity.CreatedAt
            };
        }

        public async Task<IEnumerable<AmenityResponseDto>> GetAllAsync(int societyId)
        {
            return await _context.Amenities
                .Where(a => a.SocietyId == societyId)
                .OrderBy(a => a.AmenityName)
                .Select(a => new AmenityResponseDto
                {
                    AmenityId = a.AmenityId,
                    AmenityName = a.AmenityName,
                    Description = a.Description,
                    Capacity = a.Capacity,
                    Rules = a.Rules,
                    IsActive = a.IsActive,
                    SocietyId = a.SocietyId,
                    CreatedAt = a.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<AmenityResponseDto> GetByIdAsync(int amenityId)
        {
            var amenity = await _context.Amenities
                .FirstOrDefaultAsync(a => a.AmenityId == amenityId);

            if (amenity == null)
                throw new NotFoundException("Amenity not found");

            return new AmenityResponseDto
            {
                AmenityId = amenity.AmenityId,
                AmenityName = amenity.AmenityName,
                Description = amenity.Description,
                Capacity = amenity.Capacity,
                Rules = amenity.Rules,
                IsActive = amenity.IsActive,
                SocietyId = amenity.SocietyId,
                CreatedAt = amenity.CreatedAt
            };
        }

        public async Task<IEnumerable<AmenityResponseDto>> GetActiveAmenitiesAsync(int societyId)
        {
            return await _context.Amenities
                .Where(a => a.SocietyId == societyId && a.IsActive)
                .OrderBy(a => a.AmenityName)
                .Select(a => new AmenityResponseDto
                {
                    AmenityId = a.AmenityId,
                    AmenityName = a.AmenityName,
                    Description = a.Description,
                    Capacity = a.Capacity,
                    Rules = a.Rules,
                    IsActive = a.IsActive,
                    SocietyId = a.SocietyId,
                    CreatedAt = a.CreatedAt
                })
                .ToListAsync();
        }
    }
}

