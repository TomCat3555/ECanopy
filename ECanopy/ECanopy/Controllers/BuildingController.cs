using ECanopy.Data;
using ECanopy.DTO;
using ECanopy.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ECanopy.Controllers
{
    [ApiController]
    [Route("api/buildings")]
    public class BuildingController : RwaController
    {
        private readonly IBuildingService _buildingService;

        public BuildingController(
            ApplicationDbContext context,
            IBuildingService buildingService)
            : base(context)
        {
            _buildingService = buildingService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateBuilding(CreateBuildingDto dto)
        {
            await LoadRwaContextAsync();

            return Ok(
                await _buildingService.CreateAsync(
                    RwaSocietyId!.Value, dto));
        }
    }
}
