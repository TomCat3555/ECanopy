using ECanopy.Data;
using ECanopy.DTO;
using ECanopy.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ECanopy.Controllers
{
    [ApiController]
    [Route("api/flats")]
    [Authorize(Roles = "RWA_President,RWA_Secretary")]
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

            var userId =
         User.FindFirstValue(ClaimTypes.NameIdentifier)!;

            var result =
                await _flatService.CreateAsync(userId, dto);

            return Ok(result);

        }


    }
}
