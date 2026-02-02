using ECanopy.Models;

namespace ECanopy.DTO
{
    public class SocietyResponseDto
    {
        public string SocietyName { get; set; } = null!;
        public string SocietyDescription { get; set; } = null!;
        public Address Address { get; set; } = null!;
    }
}
