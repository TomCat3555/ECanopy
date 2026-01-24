using ECanopy.DTO;
using ECanopy.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ECanopy.Controllers
{
    [ApiController]
    [Route("api/role-requests")]
    [Authorize(Roles = "Resident")]
    public class RoleRequestController : ControllerBase
    {
        private readonly IRoleRequestService _service;

        public RoleRequestController(IRoleRequestService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Create(RoleRequestDto dto)
        {
            var userId =
                User.FindFirstValue(ClaimTypes.NameIdentifier)!;

            await _service.CreateAsync(userId, dto);

            return Ok(new { message = "Role request submitted" });
        }

        [HttpGet("my")]
        public async Task<IActionResult> My()
        {
            var userId =
                User.FindFirstValue(ClaimTypes.NameIdentifier)!;

            return Ok(await _service.GetMyAsync(userId));
        }

    }
}
