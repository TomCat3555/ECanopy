using ECanopy.Data;
using ECanopy.DTO;
using ECanopy.Models;
using ECanopy.Common;
using Microsoft.EntityFrameworkCore;

namespace ECanopy.Services
{
    public interface IBuildingService
    {
        Task<BuildingResponseDto> CreateAsync(string userId, CreateBuildingDto dto);

    }
    public class BuildingService : IBuildingService
    {
        private readonly ApplicationDbContext _context;

        public BuildingService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<BuildingResponseDto> CreateAsync(
            string userId,
            CreateBuildingDto dto)
        {
            // 1. Ensure user is an active RWA
            var rwaMember = await _context.RwaMembers
                .FirstOrDefaultAsync(r =>
                    r.UserId == userId && r.IsActive);

            if (rwaMember == null)
                throw new BusinessException("User is not an RWA member");

            // 2. Only President / Secretary can create buildings
            if (rwaMember.Role != "RWA_President" &&
                rwaMember.Role != "RWA_Secretary")
                throw new BusinessException("Not authorized to create building");

            // 3. RWA must be linked to a society
            if (rwaMember.SocietyId == null)
                throw new BusinessException("RWA is not linked to any society");

            var societyId = rwaMember.SocietyId.Value;

            // 4. Ensure building is unique within society
            bool exists = await _context.Buildings.AnyAsync(b =>
                b.BuildingName == dto.BuildingName &&
                b.SocietyId == societyId);

            if (exists)
                throw new BusinessException("Building already exists");

            // 5. Create building
            var building = new Building
            {
                BuildingName = dto.BuildingName,
                SocietyId = societyId
            };

            _context.Buildings.Add(building);
            await _context.SaveChangesAsync();

            // 6. Return DTO
            return new BuildingResponseDto
            {
                BuildingName = building.BuildingName
            };
        }

    }

}
