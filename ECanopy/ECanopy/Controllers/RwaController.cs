using ECanopy.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ECanopy.Controllers
{
    [Authorize(Roles = "RWA_President,RWA_Secretary")]
    public abstract class RwaController : ControllerBase
    {
        protected readonly ApplicationDbContext _context;
        protected int? RwaSocietyId { get; private set; }

        protected RwaController(ApplicationDbContext context)
        {
            _context = context;
        }

        protected async Task LoadRwaContextAsync()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var rwa = await _context.RwaMembers
                .AsNoTracking()
                .FirstOrDefaultAsync(r =>
                    r.UserId == userId &&
                    r.IsActive);

            if (rwa == null)
                throw new UnauthorizedAccessException(
                    "RWA member profile not found");

            if (rwa.SocietyId == null)
                throw new UnauthorizedAccessException(
                    "RWA member not linked to any society");

            RwaSocietyId = rwa.SocietyId; 
        }

        protected void EnsureSameSociety(int societyId)
        {
            if (RwaSocietyId != societyId)
                throw new UnauthorizedAccessException(
                    "You are not authorized for this society");
        }
    }
}
