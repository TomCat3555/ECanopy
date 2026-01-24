using ECanopy.DTO;
using ECanopy.Services;
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
        public async Task<IActionResult> GetPending()
        {
            return Ok(await _adminService.GetPendingRoleRequestsAsync());
        }

        [HttpPost("role-requests/approve")]
        public async Task<IActionResult> Approve(ProcessRoleRequestDto dto)
        {
            await _adminService.ApproveRoleRequestAsync(dto.UserEmail);
            return Ok(new { message = "Role request approved" });
        }

        [HttpPost("role-requests/reject")]
        public async Task<IActionResult> Reject(ProcessRoleRequestDto dto)
        {
            await _adminService.RejectRoleRequestAsync(dto.UserEmail);
            return Ok(new { message = "Role request rejected" });
        }
    }
}
