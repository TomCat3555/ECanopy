using ECanopy.Data;
using ECanopy.DTO;
using ECanopy.Models;
using ECanopy.Services.Interfaces;
using ECanopy.Common;
using Microsoft.EntityFrameworkCore;

namespace ECanopy.Services
{
    public class FlatService : IFlatService
    {
        private readonly ApplicationDbContext _context;

        public FlatService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<FlatResponseDto> CreateAsync(int societyId, CreateFlatDto dto)
        {
            var building = await _context.Buildings.FirstOrDefaultAsync(b =>
                b.BuildingName == dto.BuildingName &&
                b.SocietyId == societyId);

            if (building == null)
                throw new NotFoundException("Building not found");

            if (dto.MaxResidents <= 0)
                throw new BusinessException("MaxResidents must be greater than zero");

            bool exists = await _context.Flats.AnyAsync(f =>
                f.FlatNumber == dto.FlatNumber &&
                f.BuildingId == building.BuildingId);

            if (exists)
                throw new BusinessException("Flat already exists");

            var flat = new Flat
            {
                FlatNumber = dto.FlatNumber,
                BuildingId = building.BuildingId,
                MaxResident = dto.MaxResidents,
                IsOccupied = false
            };

            _context.Flats.Add(flat);
            await _context.SaveChangesAsync();

            return new FlatResponseDto
            {
                FlatNumber = flat.FlatNumber
            };
        }
    }

}
