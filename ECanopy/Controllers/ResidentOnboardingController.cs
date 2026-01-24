/*
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
    [Route("api/residents")]
    [Authorize(Roles = "Resident")]
    public class ResidentOnboardingController : ControllerBase
    {
        private readonly IResidentOnboardingService _service;

        public ResidentOnboardingController(
            IResidentOnboardingService service)
        {
            _service = service;
        }

        [HttpPost("onboard")]
        public async Task<IActionResult> Onboard(CreateResidentDto dto)
        {
            var userId =
                User.FindFirstValue(ClaimTypes.NameIdentifier)!;

            // Controller does NOT trust any IDs in dto
            var result = await _service.CreateAsync(userId, dto);

            return Ok(result);
        }
    }
}
*/