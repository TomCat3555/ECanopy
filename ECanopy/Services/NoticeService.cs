using ECanopy.Data;
using ECanopy.DTO;
using ECanopy.Models;
using ECanopy.Common;
using Microsoft.EntityFrameworkCore;

namespace ECanopy.Services
{
    public interface INoticeService
    {
        Task CreateAsync(int societyId, CreateNoticeDto dto);
        Task<IEnumerable<Notice>> GetForResidentAsync(string userId);
    }
    public class NoticeService : INoticeService
    {
        private readonly ApplicationDbContext _context;

        public NoticeService(ApplicationDbContext context)
        {
            _context = context;
        }

        // ===============================
        // CREATE NOTICE (RWA, SOCIETY-SCOPED)
        // ===============================
        public async Task CreateAsync(int societyId, CreateNoticeDto dto)
        {
            // Ensure society exists (safety check)
            bool societyExists = await _context.Societies
                .AnyAsync(s => s.SocietyId == societyId);

            if (!societyExists)
                throw new BusinessException("Society not found");

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

        // ===============================
        // RESIDENT VIEWS OWN SOCIETY NOTICES
        // ===============================
        public async Task<IEnumerable<Notice>> GetForResidentAsync(string userId)
        {
            var resident = await _context.Residents
                .Include(r => r.Flat)
                    .ThenInclude(f => f.Building)
                .FirstOrDefaultAsync(r => r.UserId == userId)
                ?? throw new BusinessException("Resident profile not found");

            var societyId = resident.Flat.Building.SocietyId;

            return await _context.Notices
                .Where(n => n.SocietyId == societyId)
                .OrderByDescending(n => n.PublishedAt)
                .ToListAsync();
        }
    }

}
