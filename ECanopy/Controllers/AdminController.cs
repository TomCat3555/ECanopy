using ECanopy.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ECanopy.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet("role-requests/pending")]
        public async Task<IActionResult> GetPendingRoleRequests()
        {
            return Ok(await _adminService.GetPendingRoleRequestsAsync());
        }

        [HttpPost("role-requests/{id}/approve")]
        public async Task<IActionResult> ApproveRoleRequest(int id)
        {
            await _adminService.ApproveRoleRequestAsync(
                id,
                User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            return Ok("Role request approved successfully");
        }

        [HttpPost("role-requests/{id}/reject")]
        public async Task<IActionResult> RejectRoleRequest(int id)
        {
            await _adminService.RejectRoleRequestAsync(
                id,
                User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            return Ok("Role request rejected");
        }
    }
}
