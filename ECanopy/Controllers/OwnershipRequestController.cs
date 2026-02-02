using ECanopy.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ECanopy.Controllers
{
    [ApiController]
    [Route("api/ownership")]
    public class OwnershipRequestController : ControllerBase
    {

        private readonly IOwnershipRequestService _ownershipService;

        public OwnershipRequestController(
            IOwnershipRequestService ownershipService)
        {
            _ownershipService = ownershipService;
        }

        // ===============================
        // RESIDENT → REQUEST OWNERSHIP
        // ===============================
        [Authorize]
        [HttpPost("request")]
        public async Task<IActionResult> RequestOwnership()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);

            await _ownershipService.RequestOwnershipAsync(email!);

            return Ok(new
            {
                message = "Ownership request submitted successfully"
            });
        }

        // ===============================
        // RWA → APPROVE OWNERSHIP
        // ===============================
        [Authorize(Roles = "RWA_President,RWA_Secretary")]
        [HttpPost("{requestId:int}/approve")]
        public async Task<IActionResult> ApproveOwnership(int requestId)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);

            await _ownershipService.ApproveAsync(requestId, email!);

            return Ok(new
            {
                message = "Ownership request approved"
            });
        }

        // ===============================
        // RWA → REJECT OWNERSHIP
        // ===============================
        [Authorize(Roles = "RWA_President,RWA_Secretary")]
        [HttpPost("{requestId:int}/reject")]
        public async Task<IActionResult> RejectOwnership(int requestId)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);

            await _ownershipService.RejectAsync(requestId, email!);

            return Ok(new
            {
                message = "Ownership request rejected"
            });
        }

    }
}
