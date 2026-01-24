using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECanopy.Models
{
    public class Flat
    {
        [Key]
        public int FlatId { get; set; }
        [Required]
        public int BuildingId { get; set; }
        public int MaxResident { get; set; }
        public bool IsOccupied { get; set; } = false;
        [ForeignKey(nameof(BuildingId))]
        public Building? Building { get; set; }
        [Required]
        [RegularExpression(@"^[A-Z0-9\-]{1,10}$", ErrorMessage = "Invalid flat number")]
        public string FlatNumber { get; set; } = null!;
        public ICollection<Resident> Residents { get; set; }= new HashSet<Resident>();
        public ICollection<ResidentJoinRequest> JoinRequests { get; set; } = new HashSet<ResidentJoinRequest>();

    }
}
