namespace ECanopy.Models
{
    public class Resident
    {
        public int ResidentId { get; set; }
        public string FullName { get; set; }        
        public string PhoneNumber { get; set; }
        public bool IsOwner {  get; set; }
        public int FlatId { get; set; }
        public Flat Flat { get; set; }

        public string UserId { get; set; }
        public ApplicationUser User { get; set; }
    }
}
