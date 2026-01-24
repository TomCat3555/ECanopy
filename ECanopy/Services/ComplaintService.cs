using ECanopy.Common;
using ECanopy.Data;
using ECanopy.DTO;
using ECanopy.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace ECanopy.Services
{
    public interface IComplaintService
    {
        Task<Complaint> CreateComplaint(Complaint complaint);
        Task<Complaint?> GetComplaintByTicketNumber(string ticketNumber);
        Task<ComplaintComments> AddCommentByTicket(string ticketNumber, ComplaintComments comment);
        Task<Complaint?> UpdateComplaintStatusByTicket(string ticketNumber, string status);
        Task<bool> DeleteByTicket(string ticketNumber);
        Task<ComplaintAnalyticsDto> GetAnalytics();
    }

    public class ComplaintService : IComplaintService
    {
        private readonly ApplicationDbContext _context;

        public ComplaintService(ApplicationDbContext context)
        {
            _context = context;
        }

        // ===============================
        // CREATE COMPLAINT (PUBLIC)
        // ===============================
        public async Task<Complaint> CreateComplaint(Complaint complaint)
        {
            complaint.TicketNumber = GenerateTicket();
            complaint.Status = "Open";
            complaint.CreatedOn = DateTime.UtcNow;

            _context.Complaints.Add(complaint);
            await _context.SaveChangesAsync();

            return complaint;
        }

        // ===============================
        // GET BY TICKET
        // ===============================
        public async Task<Complaint?> GetComplaintByTicketNumber(string ticketNumber)
        {
            return await _context.Complaints
                .Include(c => c.Comments.OrderBy(x => x.CommentedOn))
                .Include(c => c.Attachments)
                .FirstOrDefaultAsync(c => c.TicketNumber == ticketNumber);
        }

        // ===============================
        // ADD COMMENT BY TICKET
        // ===============================
        public async Task<ComplaintComments> AddCommentByTicket(
            string ticketNumber,
            ComplaintComments comment)
        {
            var complaint = await _context.Complaints
                .FirstOrDefaultAsync(c => c.TicketNumber == ticketNumber)
                ?? throw new NotFoundException("Complaint not found");

            comment.ComplaintId = complaint.ComplaintId;
            comment.CommentedOn = DateTime.UtcNow;

            _context.ComplaintComments.Add(comment);
            await _context.SaveChangesAsync();

            return comment;
        }

        // ===============================
        // UPDATE STATUS (ADMIN)
        // ===============================
        public async Task<Complaint?> UpdateComplaintStatusByTicket(
            string ticketNumber,
            string status)
        {
            var complaint = await _context.Complaints
                .FirstOrDefaultAsync(c => c.TicketNumber == ticketNumber);

            if (complaint == null)
                return null;

            complaint.Status = status;
            complaint.UpdatedOn = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return complaint;
        }

        // ===============================
        // DELETE BY TICKET (ADMIN)
        // ===============================
        public async Task<bool> DeleteByTicket(string ticketNumber)
        {
            var complaint = await _context.Complaints
                .FirstOrDefaultAsync(c => c.TicketNumber == ticketNumber);

            if (complaint == null)
                return false;

            _context.Complaints.Remove(complaint);
            await _context.SaveChangesAsync();
            return true;
        }

        // ===============================
        // ANALYTICS
        // ===============================
        public async Task<ComplaintAnalyticsDto> GetAnalytics()
        {
            var complaints = await _context.Complaints.ToListAsync();

            return new ComplaintAnalyticsDto
            {
                TotalComplaints = complaints.Count,
                StatusCounts = complaints
                    .GroupBy(c => c.Status)
                    .ToDictionary(g => g.Key, g => g.Count())
            };
        }

        // ===============================
        // PRIVATE
        // ===============================
        private string GenerateTicket()
            => $"TKT-{DateTime.UtcNow:yyyy}-{Guid.NewGuid():N}".Substring(0, 18);

    }
   
}

