using ECanopy.Common;
using ECanopy.Data;
using ECanopy.DTO;
using ECanopy.Models;
using ECanopy.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;

namespace ECanopy.Services
{
    public interface IComplaintService
    {
        Task<Complaint> CreateComplaint(Complaint complaint);
        Task<Complaint?> GetComplaintByTicketNumber(string ticketNumber);
        Task<Complaint?> GetComplaintById(int id);
        Task<IEnumerable<Complaint>> GetAllComplaints();
        Task<Complaint?> UpdateComplaintStatus(int id, string status);
        Task<ComplaintComments> AddComment(int complaintId, ComplaintComments comment);
        Task<bool> DeleteComplaint(int id);
        string GenerateTicketNumber();
        Task<ECanopy.DTO.ComplaintAnalyticsDto> GetAnalytics();
    }

    public class ComplaintService : IComplaintService
    {
        private readonly ApplicationDbContext _context;

        public ComplaintService(ApplicationDbContext context)
        {
            _context = context;
        }

        public string GenerateTicketNumber()
        {
            var year = DateTime.UtcNow.Year;
            var lastComplaint = _context.Complaints
                .Where(c => c.TicketNumber.StartsWith($"TKT-{year}-"))
                .OrderByDescending(c => c.ComplaintId)
                .FirstOrDefault();

            int nextNumber = 1;
            if (lastComplaint != null)
            {
                var lastNumberStr = lastComplaint.TicketNumber.Split('-').Last();
                if (int.TryParse(lastNumberStr, out int lastNumber))
                {
                    nextNumber = lastNumber + 1;
                }
            }

            return $"TKT-{year}-{nextNumber:D6}";
        }

        public async Task<Complaint> CreateComplaint(Complaint complaint)
        {
            complaint.TicketNumber = GenerateTicketNumber();
            complaint.CreatedOn = DateTime.UtcNow;
            complaint.Status = "Open";

            _context.Complaints.Add(complaint);
            await _context.SaveChangesAsync();
            return complaint;
        }

        public async Task<Complaint?> GetComplaintByTicketNumber(string ticketNumber)
        {
            return await _context.Complaints
                .Include(c => c.Comments.OrderBy(cm => cm.CommentedOn))
                .Include(c => c.Attachments)
                .FirstOrDefaultAsync(c => c.TicketNumber == ticketNumber);
        }

        public async Task<Complaint?> GetComplaintById(int id)
        {
            return await _context.Complaints
                .Include(c => c.Comments.OrderBy(cm => cm.CommentedOn))
                .Include(c => c.Attachments)
                .FirstOrDefaultAsync(c => c.ComplaintId == id);
        }

        public async Task<IEnumerable<Complaint>> GetAllComplaints()
        {
            return await _context.Complaints
                .Include(c => c.Comments)
                .Include(c => c.Attachments)
                .OrderByDescending(c => c.CreatedOn)
                .ToListAsync();
        }

        public async Task<Complaint?> UpdateComplaintStatus(int id, string status)
        {
            var complaint = await _context.Complaints.FindAsync(id);
            if (complaint == null) return null;

            complaint.Status = status;
            complaint.UpdatedOn = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return complaint;
        }

        public async Task<ComplaintComments> AddComment(int complaintId, ComplaintComments comment)
        {
            comment.ComplaintId = complaintId;
            comment.CommentedOn = DateTime.UtcNow;

            _context.ComplaintComments.Add(comment);
            await _context.SaveChangesAsync();
            return comment;
        }

        public async Task<bool> DeleteComplaint(int id)
        {
            var complaint = await _context.Complaints.FindAsync(id);
            if (complaint == null) return false;

            _context.Complaints.Remove(complaint);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<ECanopy.DTO.ComplaintAnalyticsDto> GetAnalytics()
        {
            var complaints = await _context.Complaints.ToListAsync();

            var statusCounts = complaints
                .GroupBy(c => c.Status)
                .ToDictionary(g => g.Key ?? "Unknown", g => g.Count());

            var categoryCounts = complaints
                .GroupBy(c => c.Category)
                .ToDictionary(g => g.Key ?? "General", g => g.Count());

            var dailyTrends = complaints
                .GroupBy(c => c.CreatedOn.Date)
                .OrderByDescending(g => g.Key)
                .Take(7)
                .Select(g => new ECanopy.DTO.DailyTrendDto
                {
                    Date = g.Key.ToString("MMM dd, yyyy"),
                    NewComplaints = g.Count(),
                    ResolvedComplaints = g.Count(c => c.Status == "Resolved" || c.Status == "Closed")
                })
                .ToList();

            return new ECanopy.DTO.ComplaintAnalyticsDto
            {
                TotalComplaints = complaints.Count,
                StatusCounts = statusCounts,
                CategoryCounts = categoryCounts,
                DailyTrends = dailyTrends
            };
        }
    }
}
