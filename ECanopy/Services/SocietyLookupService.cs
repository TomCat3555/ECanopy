using ECanopy.Data;
using ECanopy.DTO;
using Microsoft.EntityFrameworkCore;

namespace ECanopy.Services
{
    public interface ISocietyLookupService
    {
        Task<IEnumerable<SocietyResponseDto>> GetSocietiesAsync();
        Task<IEnumerable<BuildingResponseDto>> GetBuildingsAsync(string societyName);
        Task<IEnumerable<FlatResponseDto>> GetFlatsAsync(
            string societyName,
            string buildingName);
    }

    public class SocietyLookupService : ISocietyLookupService
    {

        private readonly ApplicationDbContext _context;

        public SocietyLookupService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<SocietyResponseDto>> GetSocietiesAsync()
        {
            return await _context.Societies
                .AsNoTracking()
                .OrderBy(s => s.SocietyName)
                .Select(s => new SocietyResponseDto
                {
                    SocietyName = s.SocietyName,
                    Address = s.Address
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<BuildingResponseDto>> GetBuildingsAsync(string societyName)
        {
            societyName = societyName.Trim().ToLower();

            return await _context.Buildings
                .AsNoTracking()
                .Where(b =>
                    b.Society.SocietyName.ToLower() == societyName)
                .OrderBy(b => b.BuildingName)
                .Select(b => new BuildingResponseDto
                {
                    BuildingName = b.BuildingName
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<FlatResponseDto>> GetFlatsAsync(
            string societyName,
            string buildingName)
        {
            societyName = societyName.Trim().ToLower();
            buildingName = buildingName.Trim().ToLower();

            return await _context.Flats
                .AsNoTracking()
                .Where(f =>
                    f.Building.BuildingName.ToLower() == buildingName &&
                    f.Building.Society.SocietyName.ToLower() == societyName)
                .OrderBy(f => f.FlatNumber)
                .Select(f => new FlatResponseDto
                {
                    FlatNumber = f.FlatNumber
                })
                .ToListAsync();
        }

    }
}
