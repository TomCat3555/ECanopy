using ECanopy.Common;
using ECanopy.Data;
using ECanopy.DTO;
using ECanopy.Models;
using ECanopy.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECanopy.Controllers
{

    [ApiController]
    [Route("api/rwa/resident-requests")]
    [Authorize(Roles = "RWA_President,RWA_Secretary")]
    public class RwaResidentApprovalController : RwaController
    {
        private readonly ApplicationDbContext _context;
        private readonly IResidentOnboardingService _onboardingService;

        public RwaResidentApprovalController(
            ApplicationDbContext context,
            IResidentOnboardingService onboardingService)
            : base(context)
        {
            _context = context;
            _onboardingService = onboardingService;
        }

       
        [HttpGet("pending")]
        public async Task<IActionResult> Pending()
        {
            await LoadRwaContextAsync();

            var requests = await _context.ResidentJoinRequests
                .Include(r => r.User)
                .Include(r => r.Flat)
                    .ThenInclude(f => f.Building)
                .Where(r =>
                    r.Status == "Pending" &&
                    r.Flat.Building.SocietyId == RwaSocietyId)
                .Select(r => new PendingResidentJoinRequestDto
                {
                    UserEmail = r.User.Email,
                    UserName = r.User.FullName,
                    BuildingName = r.Flat.Building.BuildingName,
                    FlatNumber = r.Flat.FlatNumber
                })
                .ToListAsync();

            return Ok(requests);
        }

       
        [HttpPost("approve")]
        public async Task<IActionResult> Approve(ProcessResidentJoinRequestDto dto)
        {
            await LoadRwaContextAsync();

            var request = await _context.ResidentJoinRequests
                .Include(r => r.User)
                .Include(r => r.Flat)
                    .ThenInclude(f => f.Building)
                .FirstOrDefaultAsync(r =>
                    r.User.Email == dto.UserEmail &&
                    r.Status == "Pending")
                ?? throw new NotFoundException("Join request not found");

            if (request.Flat.Building.SocietyId != RwaSocietyId)
                throw new ForbiddenException("Unauthorized");

            string fullName = request.User.FullName
                ?? throw new BusinessException("Resident full name not found");

            var result = await _onboardingService.OnboardAsync(request,fullName);

            return Ok(result);
        }

        
        [HttpPost("reject")]
        public async Task<IActionResult> Reject(ProcessResidentJoinRequestDto dto)
        {
            await LoadRwaContextAsync();

            var request = await _context.ResidentJoinRequests
                .Include(r => r.User)
                .Include(r => r.Flat)
                    .ThenInclude(f => f.Building)
                .FirstOrDefaultAsync(r =>
                    r.User.Email == dto.UserEmail &&
                    r.Status == "Pending")
                ?? throw new NotFoundException("Join request not found");

            if (request.Flat.Building.SocietyId != RwaSocietyId)
                throw new ForbiddenException("Unauthorized");

            request.Status = "Rejected";
            await _context.SaveChangesAsync();

            return Ok(new { message = "Request rejected" });
        }
    }

}
