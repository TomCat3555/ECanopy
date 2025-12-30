using ECanopy.Data;
using ECanopy.DTO;
using ECanopy.Models;
using ECanopy.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECanopy.Controllers
{
    [ApiController]
    [Route("api/rwa/residents")]
    public class RwaResidentApprovalController : RwaController
    {
        private readonly IRwaResidentApprovalService _service;

        public RwaResidentApprovalController(
            ApplicationDbContext context,
            IRwaResidentApprovalService service)
            : base(context)
        {
            _service = service;
        }

        [Authorize(Roles = "RWA_President")]
        [HttpGet("pending")]
        public async Task<IActionResult> Pending()
        {
            await LoadRwaContextAsync();
            return Ok(await _service.GetPendingAsync(RwaSocietyId!.Value));
        }

        [Authorize(Roles = "RWA_President")]
        [HttpPost("{id}/approve")]
        public async Task<IActionResult> Approve(int id)
        {
            await _service.ApproveAsync(id);
            return Ok();
        }

        [Authorize(Roles = "RWA_President")]
        [HttpPost("{id}/reject")]
        public async Task<IActionResult> Reject(int id)
        {
            await _service.RejectAsync(id);
            return Ok();
        }
    }

}
