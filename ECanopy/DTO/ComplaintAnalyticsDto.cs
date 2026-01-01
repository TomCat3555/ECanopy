namespace ECanopy.DTO
{
    public class ComplaintAnalyticsDto
    {
        public int TotalComplaints { get; set; }
        public Dictionary<string, int> StatusCounts { get; set; } = new();
        public Dictionary<string, int> CategoryCounts { get; set; } = new();
        public List<DailyTrendDto> DailyTrends { get; set; } = new();
    }

    public class DailyTrendDto
    {
        public string Date { get; set; } = string.Empty;
        public int NewComplaints { get; set; }
        public int ResolvedComplaints { get; set; }
    }
}
