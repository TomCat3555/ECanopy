using ECanopy.Data;
using ECanopy.DTO;
using ECanopy.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ECanopy.Controllers
{
    [ApiController]
    [Route("api/notices")]
    public class NoticeController : RwaController
    {
        public NoticeController(ApplicationDbContext context)
            : base(context) { }

        [Authorize(Roles = "RWA_President,RWA_Secretary")]
        [HttpPost]
        public async Task<IActionResult> CreateNotice(CreateNoticeDto dto)
        {
            await LoadRwaContextAsync();

            var societyId = RwaSocietyId!.Value;

            var notice = new Notice
            {
                Title = dto.Title,
                Message = dto.Message,
                SocietyId = societyId,
                PublishedAt = DateTime.UtcNow
            };

            _context.Notices.Add(notice);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [Authorize(Roles = "Resident")]
        [HttpGet]
        public async Task<IActionResult> GetNotices()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var resident = await _context.Residents
                .Include(r => r.Flat)
                .ThenInclude(f => f.Building)
                .FirstOrDefaultAsync(r => r.UserId == userId);

            if (resident == null)
                return BadRequest("Resident profile not found");

            var societyId = resident.Flat.Building.SocietyId;

            var notices = await _context.Notices
                .Where(n => n.SocietyId == societyId)
                .OrderByDescending(n => n.PublishedAt)
                .ToListAsync();

            return Ok(notices);
        }
    }

}
