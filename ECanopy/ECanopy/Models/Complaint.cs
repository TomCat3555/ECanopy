using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECanopy.Models
{
    public class Complaint
    {
        [Key]
        public int ComplaintId {  get; set; }
        public string Title {  get; set; }
        public string Description { get; set; }

        public string Status {  get; set; }
        public DateTime CreatedAt {  get; set; }

        public int ResidentId {  get; set; }
        [ForeignKey(nameof(ResidentId))]
        public Resident Resident { get; set; }
    }
}
