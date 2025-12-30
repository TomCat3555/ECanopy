namespace ECanopy.DTO
{
    public class CreateSocietyDto
    {
        public int SocietyId {  get; set; }
        public string SocietyName { get; set; } = null!;
        public string SocietyDescription { get; set; } = null!;
        public string Owner { get; set; } = null!;
        public string Address { get; set; } = null!;
    }
}
