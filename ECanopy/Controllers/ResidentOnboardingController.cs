using ECanopy.Data;
using ECanopy.DTO;
using ECanopy.Models;
using ECanopy.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ECanopy.Controllers
{
    [ApiController]
    [Route("api/residents")]
    public class ResidentOnboardingController : ControllerBase
    {
        private readonly IResidentOnboardingService _service;

        public ResidentOnboardingController(
            IResidentOnboardingService service)
        {
            _service = service;
        }

        [Authorize(Roles = "Resident")]
        [HttpPost("onboard")]
        public async Task<IActionResult> Onboard(CreateResidentDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            return Ok(await _service.CreateAsync(userId!, dto));
        }
    }
}
