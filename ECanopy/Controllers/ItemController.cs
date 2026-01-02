
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/items")]
public class ItemController : ControllerBase {
    [HttpGet]
    public IActionResult GetItems() {
        return Ok();
    }
}
