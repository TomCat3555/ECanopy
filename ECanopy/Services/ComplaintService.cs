using ECanopy.Data;
using ECanopy.DTO;
using ECanopy.Models;
using ECanopy.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ECanopy.Services
{
    public class ComplaintService : IComplaintService
    {
        private readonly ApplicationDbContext _context;

        public ComplaintService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task RaiseAsync(string userId, CreateComplaintDto dto)
        {
            var resident = await _context.Residents
                .FirstOrDefaultAsync(r => r.UserId == userId);

            if (resident == null)
                throw new BusinessException("Resident profile not found");

            var complaint = new Complaint
            {
                Title = dto.Title,
                Description = dto.Description,
                Status = "Open",
                CreatedAt = DateTime.UtcNow,
                ResidentId = resident.ResidentId
            };

            _context.Complaints.Add(complaint);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<ComplaintResponseDto>> GetSocietyAsync(int societyId)
        {
            return await _context.Complaints
                .Where(c => c.Resident.Flat.Building.SocietyId == societyId)
                .OrderByDescending(c => c.CreatedAt)
                .Select(c => new ComplaintResponseDto
                {
                    Title = c.Title,
                    Description = c.Description,
                    Status = c.Status,
                    CreatedAt = c.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<ComplaintResponseDto>>
        GetSocietyComplaintsAsync(int societyId)
        {
            return await _context.Complaints
                .Where(c =>
                    c.Resident.Flat.Building.SocietyId == societyId)
                .OrderByDescending(c => c.CreatedAt)
                .Select(c => new ComplaintResponseDto
                {
                    Title = c.Title,
                    Description = c.Description,
                    Status = c.Status,
                    CreatedAt = c.CreatedAt
                })
                .ToListAsync();
        }
    }

}
