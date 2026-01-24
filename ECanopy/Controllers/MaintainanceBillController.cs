using ECanopy.Data;
using ECanopy.DTO;
using ECanopy.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ECanopy.Controllers
{
    [ApiController]
    [Route("api/bills")]
    public class MaintainanceBillController : ControllerBase
    {
        private readonly IMaintainanceBillService _service;

        public MaintainanceBillController(IMaintainanceBillService service)
        {
            _service = service;
        }

        // RWA creates bill
        [Authorize(Roles = "RWA_President,RWA_Secretary,RWA_Treasurer")]
        [HttpPost]
        public async Task<IActionResult> Create(CreateMaintainanceBillDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

            return Ok(
                await _service.CreateAsync(userId, dto));
        }

        // Resident views own bills
        [Authorize(Roles = "Resident")]
        [HttpGet("my")]
        public async Task<IActionResult> My()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

            return Ok(
                await _service.GetMyAsync(userId));
        }

        // RWA views all bills in society
        [Authorize(Roles = "RWA_President,RWA_Treasurer")]
        [HttpGet]
        public async Task<IActionResult> All()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

            return Ok(
                await _service.GetAllAsync(userId));
        }
    }
}
