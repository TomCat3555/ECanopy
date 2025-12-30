using ECanopy.Data;
using ECanopy.DTO;
using ECanopy.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ECanopy.Controllers
{
    [ApiController]
    [Route("api/payments")]
    [Authorize]
    public class PaymentController : RwaController
    {
        public PaymentController(ApplicationDbContext context)
            : base(context)
        {
        }

        [Authorize(Roles = "Resident")]
        [HttpPost]
        public async Task<IActionResult> MakePayment(CreatePaymentDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var resident = await _context.Residents
                .FirstOrDefaultAsync(r => r.UserId == userId);

            if (resident == null)
                return BadRequest("Resident profile not found");

            using var transaction = await _context.Database.BeginTransactionAsync();

            var bill = await _context.MaintainanceBills
                .FirstOrDefaultAsync(b => b.MaintainanceBillId == dto.MaintainanceBillId);

            if (bill == null)
                return BadRequest("Invalid bill");

            if (bill.IsPaid)
                return Conflict("Bill has already been paid");

            if (resident.FlatId != bill.FlatId)
                return Forbid("You cannot pay a bill for another flat");

            var payment = new Payment
            {
                MaintainanceBillId = bill.MaintainanceBillId,
                Amount = bill.Amount,
                PaymentType = dto.PaymentType,
                PaymentDate = DateTime.UtcNow,
                ResidentId = resident.ResidentId
            };

            bill.IsPaid = true;

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return Ok(new PaymentResponseDto
            {
                Amount = payment.Amount,
                PaymentType = payment.PaymentType,
                PaymentDate = payment.PaymentDate
            });
        }

        [Authorize(Roles = "Resident")]
        [HttpGet("my")]
        public IActionResult MyPayment()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var resident = _context.Residents
                .FirstOrDefault(r => r.UserId == userId);

            if (resident == null)
                return BadRequest("Resident profile not found");

            if (!resident.IsOwner)
                return Forbid("Only flat owner can view payments");

            var payments = _context.Payments
                .Where(p => p.MaintainanceBill.ResidentId == resident.ResidentId)
                .Select(p => new PaymentResponseDto
                {
                    Amount = p.Amount,
                    PaymentType = p.PaymentType,
                    PaymentDate = p.PaymentDate
                });

            return Ok(payments);
        }

        [Authorize(Roles = "RWA_Treasurer")]
        [HttpGet]
        public async Task<IActionResult> AllPayments()
        {
            await LoadRwaContextAsync();

            var payments = await _context.Payments
                .Where(p =>
                    p.MaintainanceBill.Flat.Building.SocietyId == RwaSocietyId)
                .Select(p => new PaymentResponseDto
                {
                    Amount = p.Amount,
                    PaymentType = p.PaymentType,
                    PaymentDate = p.PaymentDate
                })
                .ToListAsync();

            return Ok(payments);
        }
    }
}
