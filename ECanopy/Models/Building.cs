using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECanopy.Models
{
    public class Building
    {
        [Key]
        public int BuildingId { get; set; }
        [Required]
        public string BuildingName { get; set; }
        public int SocietyId { get; set; }

        [ForeignKey(nameof(SocietyId))]
        public Society Society { get; set; }
        public ICollection<Flat> Flats { get; set; }
    }
}
