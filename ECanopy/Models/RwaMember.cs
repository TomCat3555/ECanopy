using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECanopy.Models
{
    public class RwaMember
    {
        [Key]
        public int RwaMemberId { get; set; }

        [Required]
        public string UserId { get; set; } = null!;

        [ForeignKey(nameof(UserId))]
        public ApplicationUser User { get; set; } = null!;

        public int? SocietyId { get; set; }

        [ForeignKey(nameof(SocietyId))]
        public Society? Society { get; set; }

        [Required]
        public string Role { get; set; } = null!;

        public bool IsActive { get; set; } = true;
    }
}
