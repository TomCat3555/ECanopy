using ECanopy.Data;
using ECanopy.DTO;
using ECanopy.Models;
using ECanopy.Services.Interfaces;
using ECanopy.Common;
using Microsoft.EntityFrameworkCore;

namespace ECanopy.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly ApplicationDbContext _context;

        public PaymentService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PaymentResponseDto> PayAsync(string userId, CreatePaymentDto dto)
        {
            var resident = await _context.Residents
                .FirstOrDefaultAsync(r => r.UserId == userId);

            if (resident == null)
                throw new BusinessException("Resident profile not found");

            using var tx = await _context.Database.BeginTransactionAsync();

            var bill = await _context.MaintainanceBills.FindAsync(dto.MaintainanceBillId)
                ?? throw new BusinessException("Invalid bill");

            if (bill.IsPaid)
                throw new BusinessException("Bill already paid");

            if (bill.FlatId != resident.FlatId)
                throw new ForbiddenException("Cannot pay another flat's bill");

            bill.IsPaid = true;

            var payment = new Payment
            {
                MaintainanceBillId = bill.MaintainanceBillId,
                Amount = bill.Amount,
                PaymentType = dto.PaymentType,
                PaymentDate = DateTime.UtcNow,
                ResidentId = resident.ResidentId
            };

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();
            await tx.CommitAsync();

            return new PaymentResponseDto
            {
                Amount = payment.Amount,
                PaymentType = payment.PaymentType,
                PaymentDate = payment.PaymentDate
            };
        }

        public async Task<IEnumerable<PaymentResponseDto>> MyAsync(string userId)
        {
            var resident = await _context.Residents
                .FirstOrDefaultAsync(r => r.UserId == userId);

            if (resident == null || !resident.IsOwner)
                throw new ForbiddenException("Only owner can view payments");

            return await _context.Payments
                .Where(p => p.ResidentId == resident.ResidentId)
                .Select(p => new PaymentResponseDto
                {
                    Amount = p.Amount,
                    PaymentType = p.PaymentType,
                    PaymentDate = p.PaymentDate
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<PaymentResponseDto>> AllAsync(int societyId)
        {
            return await _context.Payments
                .Where(p => p.MaintainanceBill.Flat.Building.SocietyId == societyId)
                .Select(p => new PaymentResponseDto
                {
                    Amount = p.Amount,
                    PaymentType = p.PaymentType,
                    PaymentDate = p.PaymentDate
                })
                .ToListAsync();
        }
    }

}
