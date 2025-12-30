using ECanopy.Data;
using ECanopy.DTO;
using ECanopy.Models;
using ECanopy.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ECanopy.Controllers
{
    [ApiController]
    [Route("api/join-requests")]
    public class ResidentJoinRequestController : ControllerBase
    {
        private readonly IResidentJoinRequestService _service;

        public ResidentJoinRequestController(
            IResidentJoinRequestService service)
        {
            _service = service;
        }

        [Authorize(Roles = "Resident")]
        [HttpPost]
        public async Task<IActionResult> Create(ResidentJoinRequestDto dto)
        {
            await _service.CreateAsync(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!,
                dto);

            return Ok();
        }
    }

}
