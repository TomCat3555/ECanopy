using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECanopy.Models
{
    public class Flat
    {
        [Key]
        public int FlatId { get; set; }
        public int BuildingId { get; set; }
        public int MaxResident { get; set; }
        public bool IsOccupied {  get; set; }
        [ForeignKey(nameof(BuildingId))]
        public Building Building { get; set; }
        [Required]
        [RegularExpression(@"^[A-Z0-9\-]{1,10}$",ErrorMessage = "Invalid flat number")]
        public string FlatNumber { get; set; }
        public ICollection<Resident> Residents { get; set; }
        public ICollection<ResidentJoinRequest> JoinRequests { get; set; }

    }
}
