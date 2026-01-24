using ECanopy.Data;
using ECanopy.DTO;
using ECanopy.Models;
using ECanopy.Common;
using Microsoft.EntityFrameworkCore;

namespace ECanopy.Services
{
    public interface IFlatService
    {
        Task<FlatResponseDto> CreateAsync(string userId, CreateFlatDto dto);

    }

    public class FlatService : IFlatService
    {
        private readonly ApplicationDbContext _context;

        public FlatService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<FlatResponseDto> CreateAsync(string userId,CreateFlatDto dto)
        {
            // 1. Ensure user is active RWA
            var rwaMember = await _context.RwaMembers
                .FirstOrDefaultAsync(r =>
                    r.UserId == userId && r.IsActive)
                ?? throw new BusinessException("User is not an RWA member");

            // 2. Role check
            if (rwaMember.Role != "RWA_President" &&
                rwaMember.Role != "RWA_Secretary")
                throw new BusinessException("Not authorized to create flat");

            // 3. Must belong to a society
            if (rwaMember.SocietyId == null)
                throw new BusinessException("RWA not linked to any society");

            var societyId = rwaMember.SocietyId.Value;

            // 4. Resolve building by NAME (no IDs)
            var building = await _context.Buildings
                .FirstOrDefaultAsync(b =>
                    b.BuildingName == dto.BuildingName &&
                    b.SocietyId == societyId)
                ?? throw new NotFoundException("Building not found");

            // 5. Validate max residents
            if (dto.MaxResidents <= 0)
                throw new BusinessException("MaxResidents must be greater than zero");

            // 6. Ensure flat uniqueness
            bool exists = await _context.Flats.AnyAsync(f =>
                f.FlatNumber == dto.FlatNumber &&
                f.BuildingId == building.BuildingId);

            if (exists)
                throw new BusinessException("Flat already exists");

            // 7. Create flat entity
            var flat = new Flat
            {
                FlatNumber = dto.FlatNumber,
                BuildingId = building.BuildingId,
                MaxResident = dto.MaxResidents,
                IsOccupied = false
            };

            _context.Flats.Add(flat);
            await _context.SaveChangesAsync();

            // 8. Return DTO (NOT entity)
            return new FlatResponseDto
            {
                FlatNumber = flat.FlatNumber
            };
        }
    }

}
