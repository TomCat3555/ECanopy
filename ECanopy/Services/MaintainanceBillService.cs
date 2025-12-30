using ECanopy.Data;
using ECanopy.DTO;
using ECanopy.Models;
using ECanopy.Common;
using ECanopy.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ECanopy.Services
{
    public class MaintainanceBillService : IMaintainanceBillService
    {
        private readonly ApplicationDbContext _context;

        public MaintainanceBillService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<MaintainanceBillResponseDto> CreateAsync(
            int societyId, CreateMaintainanceBillDto dto)
        {
            var building = await _context.Buildings.FirstOrDefaultAsync(b =>
                b.BuildingName == dto.BuildingName &&
                b.SocietyId == societyId);

            if (building == null)
                throw new NotFoundException("Building not found");

            var flat = await _context.Flats.FirstOrDefaultAsync(f =>
                f.FlatNumber == dto.FlatNumber &&
                f.BuildingId == building.BuildingId);

            if (flat == null)
                throw new NotFoundException("Flat not found");

            if (!flat.IsOccupied)
                throw new BusinessException("Flat is not occupied");

            var bill = new MaintainanceBill
            {
                FlatId = flat.FlatId,
                Amount = dto.Amount,
                DueDate = dto.DueDate,
                IsPaid = false
            };

            _context.MaintainanceBills.Add(bill);
            await _context.SaveChangesAsync();

            return new MaintainanceBillResponseDto
            {
                Amount = bill.Amount,
                DueDate = bill.DueDate,
                IsPaid = bill.IsPaid
            };
        }

        public async Task<IEnumerable<MaintainanceBillResponseDto>> GetMyAsync(string userId)
        {
            var resident = await _context.Residents
                .Include(r => r.Flat)
                .FirstOrDefaultAsync(r => r.UserId == userId);

            if (resident == null || !resident.IsOwner)
                throw new ForbiddenException("Only owner can view bills");

            return await _context.MaintainanceBills
                .Where(b => b.FlatId == resident.FlatId)
                .Select(b => new MaintainanceBillResponseDto
                {
                    Amount = b.Amount,
                    DueDate = b.DueDate,
                    IsPaid = b.IsPaid
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<MaintainanceBillResponseDto>> GetAllAsync(int societyId)
        {
            return await _context.MaintainanceBills
                .Where(b => b.Flat.Building.SocietyId == societyId)
                .Select(b => new MaintainanceBillResponseDto
                {
                    Amount = b.Amount,
                    DueDate = b.DueDate,
                    IsPaid = b.IsPaid
                })
                .ToListAsync();
        }
    }

}
