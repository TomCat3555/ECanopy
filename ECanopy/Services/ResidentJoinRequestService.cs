using ECanopy.Common;
using ECanopy.Data;
using ECanopy.DTO;
using ECanopy.Models;
using ECanopy.Services.Interfaces;

namespace ECanopy.Services
{
    public class ResidentJoinRequestService : IResidentJoinRequestService
    {
        private readonly ApplicationDbContext _context;

        public ResidentJoinRequestService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task CreateAsync(string userId, ResidentJoinRequestDto dto)
        {
            bool exists = _context.ResidentJoinRequests.Any(r =>
                r.UserId == userId && r.Status == "Pending");

            if (exists)
                throw new BusinessException("Join request already pending");

            var request = new ResidentJoinRequest
            {
                UserId = userId,
                //FlatId = dto.FlatId,
                Status = "Pending"
            };

            _context.ResidentJoinRequests.Add(request);
            await _context.SaveChangesAsync();
        }
    }

}
