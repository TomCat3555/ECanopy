namespace ECanopy.Models
{
    public class Resident
    {
        public int ResidentId { get; set; }
        public string FullName { get; set; } = null!;        
        public string PhoneNumber { get; set; } = null!;
        public bool IsOwner {  get; set; }
        public int FlatId { get; set; }
        public Flat Flat { get; set; } = null!;

        public string UserId { get; set; } = null!;
        public ApplicationUser User { get; set; } = null!;
    }
}
