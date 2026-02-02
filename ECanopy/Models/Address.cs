using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace ECanopy.Models
{
    [Owned]
    public class Address
    {
        [Required]
        [StringLength(150, MinimumLength = 5)]
        public string Street { get; set; } = null!;

        [Required]
        [StringLength(100)]
        public string City { get; set; } = null!;

        [Required]
        [RegularExpression(@"^\d{6}$", ErrorMessage = "Pin code must be 6 digits")]
        public string PinCode { get; set; } = null!;

        [Required]
        public State State { get; set; }
    }
}
