using ECanopy.Data;
using ECanopy.DTO;
using ECanopy.Models;
using ECanopy.Services;
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
        private readonly INoticeService _noticeService;

        public NoticeController(
            ApplicationDbContext context,
            INoticeService noticeService)
            : base(context)
        {
            _noticeService = noticeService;
        }

        
        [Authorize(Roles = "RWA_President,RWA_Secretary")]
        [HttpPost]
        public async Task<IActionResult> CreateNotice(CreateNoticeDto dto)
        {
            await LoadRwaContextAsync();

            await _noticeService.CreateAsync(
                RwaSocietyId!.Value,
                dto);

            return Ok(new { message = "Notice published" });
        }

        [Authorize(Roles = "Resident,RWA_President,RWA_Secretary,RWA_Treasurer")]
        [HttpGet]
        public async Task<IActionResult> GetNotices()
        {
            var userId =
                User.FindFirstValue(ClaimTypes.NameIdentifier)!;

            var notices =
                await _noticeService.GetForResidentAsync(userId);

            return Ok(notices);
        }
    }

}
