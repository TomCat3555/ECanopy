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
    [Route("api/societies")]
    public class SocietyController : ControllerBase
    {
        private readonly ISocietyService _service;

        public SocietyController(ISocietyService service)
        {
            _service = service;
        }

        [Authorize(Roles = "RWA_President,RWA_Secretary")]
        [HttpPost]
        public async Task<IActionResult> CreateSociety(CreateSocietyDto dto)
        {
            var userId =
                User.FindFirstValue(ClaimTypes.NameIdentifier)!;

            var result =
                await _service.CreateAsync(userId, dto);

            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _service.GetAllAsync());
        }
    }

}


