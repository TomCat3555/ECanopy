using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECanopy.Models
{
    public class Building
    {
        [Key]
        public int BuildingId { get; set; }
        [Required]
        [RegularExpression(@"^[a-zA-Z0-9\s\-]{2,50}$", ErrorMessage = "Building name is invalid")]
        public string BuildingName { get; set; } = null!;
        public int SocietyId { get; set; }

        [ForeignKey(nameof(SocietyId))]
        public Society Society { get; set; } = null!;
        public ICollection<Flat> Flats { get; set; } = new List<Flat>();
    }
}
