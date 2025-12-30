using ECanopy.Data;
using ECanopy.DTO;
using ECanopy.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ECanopy.Controllers
{
    [ApiController]
    [Route("api/flats")]
    public class FlatController : RwaController
    {
        private readonly IFlatService _flatService;

        public FlatController(
            ApplicationDbContext context,
            IFlatService flatService)
            : base(context)
        {
            _flatService = flatService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateFlat(CreateFlatDto dto)
        {
            await LoadRwaContextAsync();

            return Ok(
                await _flatService.CreateAsync(
                    RwaSocietyId!.Value, dto));
        }
    }
}
