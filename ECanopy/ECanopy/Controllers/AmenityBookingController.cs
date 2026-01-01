using ECanopy.Data;
using ECanopy.DTO;
using ECanopy.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ECanopy.Controllers
{
    [ApiController]
    [Route("api/amenity-bookings")]
    public class AmenityBookingController : RwaController
    {
        private readonly IAmenityBookingService _bookingService;

        public AmenityBookingController(
            ApplicationDbContext context,
            IAmenityBookingService bookingService)
            : base(context)
        {
            _bookingService = bookingService;
        }

        [Authorize(Roles = "Resident")]
        [HttpPost]
        public async Task<IActionResult> CreateBooking(CreateAmenityBookingDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized();
            return Ok(await _bookingService.CreateAsync(userId, dto));
        }

        [Authorize(Roles = "Resident")]
        [HttpGet("my")]
        public async Task<IActionResult> GetMyBookings()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized();
            return Ok(await _bookingService.GetMyBookingsAsync(userId));
        }

        [Authorize(Roles = "Resident")]
        [HttpGet("available")]
        public async Task<IActionResult> GetAvailableTimeSlots(
            [FromQuery] int amenityId,
            [FromQuery] DateTime date)
        {
            return Ok(await _bookingService.GetAvailableTimeSlotsAsync(amenityId, date));
        }

        [Authorize(Roles = "RWA_President,RWA_Secretary")]
        [HttpGet("pending")]
        public async Task<IActionResult> GetPendingBookings()
        {
            await LoadRwaContextAsync();
            if (RwaSocietyId == null)
                return BadRequest("Society not found");
            return Ok(await _bookingService.GetPendingBookingsAsync(RwaSocietyId.Value));
        }

        [Authorize(Roles = "RWA_President,RWA_Secretary")]
        [HttpPost("{id}/approve")]
        public async Task<IActionResult> ApproveBooking(int id)
        {
            await LoadRwaContextAsync();
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized();
            await _bookingService.ApproveAsync(id, userId);
            return Ok();
        }

        [Authorize(Roles = "RWA_President,RWA_Secretary")]
        [HttpPost("{id}/reject")]
        public async Task<IActionResult> RejectBooking(int id)
        {
            await LoadRwaContextAsync();
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized();
            await _bookingService.RejectAsync(id, userId);
            return Ok();
        }

        [Authorize(Roles = "RWA_President,RWA_Secretary")]
        [HttpGet]
        public async Task<IActionResult> GetAllBookings()
        {
            await LoadRwaContextAsync();
            if (RwaSocietyId == null)
                return BadRequest("Society not found");
            return Ok(await _bookingService.GetAllBookingsAsync(RwaSocietyId.Value));
        }
    }
}

