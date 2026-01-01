using ECanopy.Data;
using ECanopy.DTO;
using ECanopy.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECanopy.Controllers
{
    [ApiController]
    [Route("api/amenities")]
    public class AmenityController : RwaController
    {
        private readonly IAmenityService _amenityService;

        public AmenityController(
            ApplicationDbContext context,
            IAmenityService amenityService)
            : base(context)
        {
            _amenityService = amenityService;
        }

        [Authorize(Roles = "RWA_President,RWA_Secretary")]
        [HttpPost]
        public async Task<IActionResult> Create(CreateAmenityDto dto)
        {
            await LoadRwaContextAsync();
            if (RwaSocietyId == null)
                return BadRequest("Society not found");
            return Ok(await _amenityService.CreateAsync(RwaSocietyId.Value, dto));
        }

        [Authorize(Roles = "RWA_President,RWA_Secretary")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            await LoadRwaContextAsync();
            if (RwaSocietyId == null)
                return BadRequest("Society not found");
            return Ok(await _amenityService.GetAllAsync(RwaSocietyId.Value));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            return Ok(await _amenityService.GetByIdAsync(id));
        }

        [HttpGet("society/{societyId}")]
        public async Task<IActionResult> GetActiveAmenities(int societyId)
        {
            return Ok(await _amenityService.GetActiveAmenitiesAsync(societyId));
        }
    }
}

