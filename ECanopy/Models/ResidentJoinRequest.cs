using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECanopy.Models
{
    public class ResidentJoinRequest
    {
        [Key]
        public int ResidentJoinRequestId { get; set; }
        public string UserId { get; set; } = null!;

        [ForeignKey(nameof(UserId))]
        public ApplicationUser User { get; set; }
        public int FlatId { get; set; }
        public string Status { get; set; } = "Pending";

        [ForeignKey(nameof(FlatId))]
        public Flat Flat { get; set; }
    }
}
