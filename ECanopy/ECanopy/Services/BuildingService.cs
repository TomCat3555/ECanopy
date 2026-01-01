using ECanopy.Data;
using ECanopy.DTO;
using ECanopy.Models;
using ECanopy.Common;
using ECanopy.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ECanopy.Services
{
    public class BuildingService : IBuildingService
    {
        private readonly ApplicationDbContext _context;

        public BuildingService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<BuildingResponseDto> CreateAsync(
            int societyId,
            CreateBuildingDto dto)
        {
            if (!await _context.Societies.AnyAsync(s => s.SocietyId == societyId))
                throw new NotFoundException("Society not found");

            if (await _context.Buildings.AnyAsync(b =>
                b.BuildingName == dto.BuildingName &&
                b.SocietyId == societyId))
                throw new BusinessException("Building already exists");

            var building = new Building
            {
                BuildingName = dto.BuildingName,
                SocietyId = societyId
            };

            _context.Buildings.Add(building);
            await _context.SaveChangesAsync();

            return new BuildingResponseDto { Name = building.BuildingName };
        }
    }

}
