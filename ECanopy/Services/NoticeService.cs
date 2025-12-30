using ECanopy.Data;
using ECanopy.DTO;
using ECanopy.Models;
using ECanopy.Services.Interfaces;
using ECanopy.Common;
using Microsoft.EntityFrameworkCore;

namespace ECanopy.Services
{
    public class NoticeService : INoticeService
    {
        private readonly ApplicationDbContext _context;

        public NoticeService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task CreateAsync(int societyId, CreateNoticeDto dto)
        {
            var notice = new Notice
            {
                Title = dto.Title,
                Message = dto.Message,
                SocietyId = societyId,
                PublishedAt = DateTime.UtcNow
            };

            _context.Notices.Add(notice);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Notice>> GetForResidentAsync(string userId)
        {
            var resident = await _context.Residents
                .Include(r => r.Flat)
                .ThenInclude(f => f.Building)
                .FirstOrDefaultAsync(r => r.UserId == userId);

            if (resident == null)
                throw new BusinessException("Resident profile not found");

            return await _context.Notices
                .Where(n => n.SocietyId == resident.Flat.Building.SocietyId)
                .OrderByDescending(n => n.PublishedAt)
                .ToListAsync();
        }
    }

}
