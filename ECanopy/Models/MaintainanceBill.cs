using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECanopy.Models
{
    public class MaintainanceBill
    {
        [Key]
        public int MaintainanceBillId { get; set; }
        public decimal Amount { get; set; }
        public DateTime DueDate { get; set; }
        public bool IsPaid { get; set; }
        public int ResidentId { get; set; }

        [ForeignKey(nameof(ResidentId))]
        public Resident Resident { get; set; }
        public int FlatId {  get; set; }
        [ForeignKey(nameof(FlatId))]
        public Flat Flat {get; set; }
    }
}
