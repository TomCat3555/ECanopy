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
            return await _context.Buildings
                .Where(b => b.Society.SocietyName == societyName)
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
            return await _context.Flats
                .Where(f =>
                    f.Building.BuildingName == buildingName &&
                    f.Building.Society.SocietyName == societyName)
                .OrderBy(f => f.FlatNumber)
                .Select(f => new FlatResponseDto
                {
                    FlatNumber = f.FlatNumber,
                })
                .ToListAsync();
        }

    }
}
