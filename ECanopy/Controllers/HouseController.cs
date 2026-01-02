
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/houses")]
public class HouseController : ControllerBase {
    [HttpGet]
    public IActionResult GetHouses() {
        return Ok();
    }
}
