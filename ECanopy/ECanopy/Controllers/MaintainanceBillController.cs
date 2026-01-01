using ECanopy.Data;
using ECanopy.DTO;
using ECanopy.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ECanopy.Controllers
{
    [ApiController]
    [Route("api/bills")]
    public class MaintainanceBillController : RwaController
    {
        private readonly IMaintainanceBillService _billService;

        public MaintainanceBillController(
            ApplicationDbContext context,
            IMaintainanceBillService billService)
            : base(context)
        {
            _billService = billService;
        }

        [Authorize(Roles = "RWA_Treasurer,Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateBill(CreateMaintainanceBillDto dto)
        {
            await LoadRwaContextAsync();

            return Ok(
                await _billService.CreateAsync(
                    RwaSocietyId!.Value, dto));
        }

        [Authorize(Roles = "Resident")]
        [HttpGet("my")]
        public async Task<IActionResult> GetMyBills()
        {
            return Ok(
                await _billService.GetMyAsync(
                    User.FindFirstValue(ClaimTypes.NameIdentifier)!));
        }

        [Authorize(Roles = "RWA_President,RWA_Treasurer")]
        [HttpGet]
        public async Task<IActionResult> GetAllBills()
        {
            await LoadRwaContextAsync();

            return Ok(
                await _billService.GetAllAsync(
                    RwaSocietyId!.Value));
        }
    }
}
