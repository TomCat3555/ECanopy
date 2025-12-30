using ECanopy.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ECanopy.Controllers
{
    [ApiController]
    [Route("api/role-requests")]
    public class RoleRequestController : ControllerBase
    {
        private readonly IRoleRequestService _service;

        public RoleRequestController(IRoleRequestService service)
        {
            _service = service;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create(
            string role,
            int societyId)
        {
            await _service.CreateAsync(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!,
                role,
                societyId);

            return Ok();
        }

        [Authorize]
        [HttpGet("my")]
        public async Task<IActionResult> My()
        {
            return Ok(await _service.GetMyAsync(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!));
        }
    }

}
