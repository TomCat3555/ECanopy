using ECanopy.Data;
using ECanopy.DTO;
using ECanopy.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ECanopy.Controllers
{
    [ApiController]
    [Route("api/complaints")]
    public class ComplaintController : RwaController
    {
        private readonly IComplaintService _complaintService;

        public ComplaintController(
            ApplicationDbContext context,
            IComplaintService complaintService)
            : base(context)
        {
            _complaintService = complaintService;
        }

        [Authorize(Roles = "Resident")]
        [HttpPost]
        public async Task<IActionResult> RaiseComplaint(CreateComplaintDto dto)
        {
            await _complaintService.RaiseAsync(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!,
                dto);

            return Ok();
        }

        [Authorize(Roles = "RWA_President")]
        [HttpGet]
        public async Task<IActionResult> GetComplaints()
        {
            await LoadRwaContextAsync();

            return Ok(
                await _complaintService.GetSocietyComplaintsAsync(
                    RwaSocietyId!.Value));
        }
    }
}
