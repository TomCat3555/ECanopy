using ECanopy.Data;
using ECanopy.DTO;
using ECanopy.Models;
using Microsoft.EntityFrameworkCore;

namespace ECanopy.Services
{
    public class SocietyService
    {
        private readonly ApplicationDbContext _context;

        public SocietyService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<SocietyResponseDto> CreateAsync(CreateSocietyDto dto)
        {
            var society = new Society
            {
                SocietyName = dto.SocietyName,
                Address = dto.Address
            };

            _context.Societies.Add(society);
            await _context.SaveChangesAsync();

            return new SocietyResponseDto
            {
                SocietyId = society.SocietyId,
                SocietyName = society.SocietyName
            };
        }

        public async Task<IEnumerable<SocietyResponseDto>> GetAllAsync()
        {
            return await _context.Societies
                .OrderBy(s => s.SocietyName)
                .Select(s => new SocietyResponseDto
                {
                    SocietyId = s.SocietyId,
                    SocietyName = s.SocietyName
                })
                .ToListAsync();
        }
    }
}
