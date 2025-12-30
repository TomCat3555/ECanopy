using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECanopy.Models
{
    public class Payment
    {
        [Key]
        public int PaymentId { get; set; }
        public decimal Amount { get; set; }
        public DateTime PaymentDate { get; set; }
        public string PaymentType { get; set; }
        public int ResidentId { get; set; }
        [ForeignKey(nameof(ResidentId))]
        public Resident Resident { get; set; }
        public int MaintainanceBillId { get; set; }
        [ForeignKey(nameof(MaintainanceBillId))]
        public MaintainanceBill MaintainanceBill { get; set; }
    }

}
