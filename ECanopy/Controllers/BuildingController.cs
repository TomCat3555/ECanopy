using ECanopy.Data;
using ECanopy.DTO;
using ECanopy.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ECanopy.Controllers
{
    [ApiController]
    [Route("api/buildings")]
    [Authorize(Roles = "RWA_President,RWA_Secretary")]
    public class BuildingController : ControllerBase
    {
        private readonly IBuildingService _buildingService;

        public BuildingController(IBuildingService buildingService)
        {
            _buildingService = buildingService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateBuilding(CreateBuildingDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

            var result = await _buildingService.CreateAsync(userId, dto);

            return Ok(result);
        }
    }
}
