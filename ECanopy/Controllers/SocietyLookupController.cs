using ECanopy.Services;
using Microsoft.AspNetCore.Mvc;

namespace ECanopy.Controllers
{
    [ApiController]
    [Route("api/lookup")]
    public class SocietyLookupController : ControllerBase
    {
        private readonly ISocietyLookupService _lookup;

        public SocietyLookupController(ISocietyLookupService lookup)
        {
            _lookup = lookup;
        }

        [HttpGet("societies")]
        public async Task<IActionResult> GetSocieties()
            => Ok(await _lookup.GetSocietiesAsync());

        [HttpGet("societies/{societyName}/buildings")]
        public async Task<IActionResult> GetBuildings(string societyName)
            => Ok(await _lookup.GetBuildingsAsync(societyName));

        [HttpGet("societies/{societyName}/buildings/{buildingName}/flats")]
        public async Task<IActionResult> GetFlats(
            string societyName, string buildingName)
            => Ok(await _lookup.GetFlatsAsync(societyName, buildingName));
    }

}
