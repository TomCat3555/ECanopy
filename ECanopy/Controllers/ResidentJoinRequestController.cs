using ECanopy.Data;
using ECanopy.DTO;
using ECanopy.Models;
using ECanopy.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ECanopy.Controllers
{
    [ApiController]
    [Route("api/join-requests")]
    [Authorize(Roles = "Resident")]
    public class ResidentJoinRequestController : ControllerBase
    {
        private readonly IResidentJoinRequestService _service;

        public ResidentJoinRequestController(IResidentJoinRequestService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Create(ResidentJoinRequestDto dto)
        {
            var userId =
                User.FindFirstValue(ClaimTypes.NameIdentifier)!;

            await _service.CreateAsync(userId, dto);

            return Ok(new { message = "Join request submitted" });
        }
    }

}
