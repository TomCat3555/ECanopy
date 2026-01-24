using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace ECanopy.Models
{
    public class ApplicationUser:IdentityUser
    {
        [Required]
        [RegularExpression(@"^[a-zA-Z ]{3,50}$",
        ErrorMessage = "Full name must be 3–50 letters only")]
        public string FullName { get; set; } = null!;

        public Resident? Resident { get; set; }

        public ICollection<ResidentJoinRequest> JoinRequests { get; set; } = new List<ResidentJoinRequest>();
    }
}
