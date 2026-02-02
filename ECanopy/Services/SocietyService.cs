using ECanopy.Common;
using ECanopy.Data;
using ECanopy.DTO;
using ECanopy.Models;
using Microsoft.EntityFrameworkCore;
using System.Net.Sockets;

namespace ECanopy.Services
{
    public interface ISocietyService
    {
        Task<SocietyResponseDto> CreateAsync(string userId, CreateSocietyDto dto);
        Task<IEnumerable<SocietyResponseDto>> GetAllAsync();
    }

    public class SocietyService : ISocietyService
    {
        private readonly ApplicationDbContext _context;


        public SocietyService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<SocietyResponseDto> CreateAsync(
            string userId,
            CreateSocietyDto dto)
        {
            var rwaMember = await _context.RwaMembers
                .FirstOrDefaultAsync(r =>
                    r.UserId == userId && r.IsActive);

            if (rwaMember == null)
                throw new BusinessException("User is not an RWA member");

            if (rwaMember.Role != "RWA_President" &&
                rwaMember.Role != "RWA_Secretary")
                throw new BusinessException("Not authorized to create society");

            if (rwaMember.SocietyId != null)
                throw new BusinessException("RWA already manages a society");

            bool exists = await _context.Societies
                .AnyAsync(s => s.SocietyName == dto.SocietyName);

            if (exists)
                throw new BusinessException("Society already exists");

            var society = new Society
            {
                SocietyName = dto.SocietyName,
                SocietyDescription = dto.SocietyDescription,
                Address = dto.Address
            };

            _context.Societies.Add(society);

            rwaMember.Society = society;

            await _context.SaveChangesAsync();

            return new SocietyResponseDto
            {
                SocietyName = society.SocietyName,
                SocietyDescription = society.SocietyDescription,
                Address = society.Address
            };
        }

        public async Task<IEnumerable<SocietyResponseDto>> GetAllAsync()
        {
            return await _context.Societies
                .AsNoTracking()
                .OrderBy(s => s.SocietyName)
                .Select(s => new SocietyResponseDto
                {
                    SocietyName = s.SocietyName,
                    SocietyDescription = s.SocietyDescription,
                    Address = s.Address
                })
                .ToListAsync();
        }

    }
}
