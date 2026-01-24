using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.Contracts;

namespace ECanopy.Models
{
    public class Notice
    {
        public int NoticeId { get; set; }
        [Required]
        public int SocietyId { get; set; }

        [ForeignKey(nameof(SocietyId))]
        public Society Society { get; set; } = null!;
        public string Title { get; set; } = null!;
        public string Message { get; set; } = null!;
        public DateTime PublishedAt {  get; set; }

    }
}
