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
    [Route("api/payments")]
    [Authorize]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;
        private readonly ApplicationDbContext _context;

        public PaymentController(
            ApplicationDbContext context,
            IPaymentService paymentService)
        {
            _context = context;
            _paymentService = paymentService;
        }

        
        [Authorize(Roles = "Resident")]
        [HttpPost]
        public async Task<IActionResult> MakePayment(CreatePaymentDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

            var result = await _paymentService.PayAsync(userId, dto);

            return Ok(result);
        }

        
        [Authorize(Roles = "Resident")]
        [HttpGet("my")]
        public async Task<IActionResult> MyPayments()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

            var result = await _paymentService.MyAsync(userId);

            return Ok(result);
        }

        
        [Authorize(Roles = "RWA_Treasurer")]
        [HttpGet]
        public async Task<IActionResult> AllPayments()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

            var rwa = await _context.RwaMembers
                .FirstOrDefaultAsync(r => r.UserId == userId && r.IsActive)
                ?? throw new UnauthorizedAccessException();

            var result = await _paymentService.AllAsync(rwa.SocietyId!.Value);

            return Ok(result);
        }
    }
}
