using ECanopy.Data;
using ECanopy.DTO;
using ECanopy.Models;
using ECanopy.Common;
using Microsoft.EntityFrameworkCore;

namespace ECanopy.Services
{
    public interface IPaymentService
    {
        Task<PaymentResponseDto> PayAsync(string userId, CreatePaymentDto dto);
        Task<IEnumerable<PaymentResponseDto>> MyAsync(string userId);
        Task<IEnumerable<PaymentResponseDto>> AllAsync(int societyId);
    }
    public class PaymentService : IPaymentService
    {
        private readonly ApplicationDbContext _context;

        public PaymentService(ApplicationDbContext context)
        {
            _context = context;
        }

        // ===============================
        // RESIDENT PAYS MAINTENANCE BILL
        // ===============================
        public async Task<PaymentResponseDto> PayAsync(
            string userId,
            CreatePaymentDto dto)
        {
            var resident = await _context.Residents
                .FirstOrDefaultAsync(r => r.UserId == userId)
                ?? throw new BusinessException("Resident profile not found");

            using var tx = await _context.Database.BeginTransactionAsync();

            var bill = await _context.MaintainanceBills
                .Include(b => b.Flat)
                .FirstOrDefaultAsync(b => b.MaintainanceBillId == dto.MaintainanceBillId)
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

        // ===============================
        // OWNER VIEWS OWN PAYMENTS
        // ===============================
        public async Task<IEnumerable<PaymentResponseDto>> MyAsync(string userId)
        {
            var resident = await _context.Residents
                .FirstOrDefaultAsync(r => r.UserId == userId);

            if (resident == null || !resident.IsOwner)
                throw new ForbiddenException("Only owner can view payments");

            return await _context.Payments
                .Where(p => p.ResidentId == resident.ResidentId)
                .OrderByDescending(p => p.PaymentDate)
                .Select(p => new PaymentResponseDto
                {
                    Amount = p.Amount,
                    PaymentType = p.PaymentType,
                    PaymentDate = p.PaymentDate
                })
                .ToListAsync();
        }

        // ===============================
        // RWA VIEWS ALL SOCIETY PAYMENTS
        // ===============================
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

