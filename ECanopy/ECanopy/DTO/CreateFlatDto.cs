namespace ECanopy.DTO
{
    public class CreateFlatDto
    {
        public string SocietyName { get; set; }
        public string BuildingName { get; set; }
        public string FlatNumber { get; set; } = null!;
        public int MaxResidents { get; set; }
    }
}
