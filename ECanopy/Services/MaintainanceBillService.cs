using ECanopy.Data;
using ECanopy.DTO;
using ECanopy.Models;
using ECanopy.Common;
using Microsoft.EntityFrameworkCore;

namespace ECanopy.Services
{
    public interface IMaintainanceBillService
    {
        Task<MaintainanceBillResponseDto> CreateAsync(
        string userId,
        CreateMaintainanceBillDto dto);

        Task<IEnumerable<MaintainanceBillResponseDto>> GetMyAsync(string userId);

        Task<IEnumerable<MaintainanceBillResponseDto>> GetAllAsync(string userId);
    }
    public class MaintainanceBillService : IMaintainanceBillService
    {
        private readonly ApplicationDbContext _context;

        public MaintainanceBillService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<MaintainanceBillResponseDto> CreateAsync(
            string userId,
            CreateMaintainanceBillDto dto)
        {
            var rwa = await _context.RwaMembers
                .FirstOrDefaultAsync(r => r.UserId == userId && r.IsActive)
                ?? throw new ForbiddenException("User is not an RWA member");

            if (rwa.Role != "RWA_President" &&
                rwa.Role != "RWA_Secretary" &&
                rwa.Role != "RWA_Treasurer")
                throw new ForbiddenException("Not authorized to create bills");

            if (rwa.SocietyId == null)
                throw new BusinessException("RWA not linked to a society");

            var building = await _context.Buildings
                .FirstOrDefaultAsync(b =>
                    b.BuildingName == dto.BuildingName &&
                    b.SocietyId == rwa.SocietyId)
                ?? throw new NotFoundException("Building not found");

            var flat = await _context.Flats
                .FirstOrDefaultAsync(f =>
                    f.FlatNumber == dto.FlatNumber &&
                    f.BuildingId == building.BuildingId)
                ?? throw new NotFoundException("Flat not found");

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

        // ===============================
        // RESIDENT: MY BILLS
        // ===============================
        public async Task<IEnumerable<MaintainanceBillResponseDto>> GetMyAsync(
            string userId)
        {
            var resident = await _context.Residents
                .FirstOrDefaultAsync(r => r.UserId == userId)
                ?? throw new BusinessException("Resident profile not found");

            if (!resident.IsOwner)
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

        // ===============================
        // RWA: ALL BILLS (SOCIETY)
        // ===============================
        public async Task<IEnumerable<MaintainanceBillResponseDto>> GetAllAsync(
            string userId)
        {
            var rwa = await _context.RwaMembers
                .FirstOrDefaultAsync(r => r.UserId == userId && r.IsActive)
                ?? throw new ForbiddenException("Not authorized");

            return await _context.MaintainanceBills
                .Where(b =>
                    b.Flat.Building.SocietyId == rwa.SocietyId)
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
