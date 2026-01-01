using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using System.Diagnostics.Contracts;

namespace ECanopy.Models
{
    public class Notice
    {
        public int NoticeId { get; set; }
        public int SocietyId {  get; set; }
        public string Title {  get; set; }
        public string Message { get; set; }
        public DateTime PublishedAt {  get; set; }

    }
}
