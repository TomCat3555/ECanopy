using ECanopy.Data;
using ECanopy.DTO;
using ECanopy.Models;
using ECanopy.Services;
using ECanopy.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using static ECanopy.DTO.ComplaintDtos;

namespace ECanopy.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ComplaintsController : ControllerBase
    {
        private readonly IComplaintService _complaintService;

        public ComplaintsController(IComplaintService complaintService)
        {
            _complaintService = complaintService;
        }

        [HttpPost]
        public async Task<ActionResult<ComplaintResponseDto>> CreateComplaint(CreateComplaintDto dto)
        {
            var complaint = new Complaint
            {
                Category = dto.Category,
                Description = dto.Description,
                Priority = dto.Priority,
                ContactName = dto.ContactName,
                ContactPhone = dto.ContactPhone,
                ContactEmail = dto.ContactEmail
            };

            var created = await _complaintService.CreateComplaint(complaint);

            var response = MapToResponseDto(created);
            return CreatedAtAction(nameof(GetComplaintByTicket), new { ticketNumber = created.TicketNumber }, response);
        }

        // GET: api/complaints/track/{ticketNumber} - Track complaint by ticket number
        [HttpGet("track/{ticketNumber}")]
        public async Task<ActionResult<ComplaintResponseDto>> GetComplaintByTicket(string ticketNumber)
        {
            var complaint = await _complaintService.GetComplaintByTicketNumber(ticketNumber);
            if (complaint == null)
                return NotFound(new { message = "Complaint not found with this ticket number" });

            return Ok(MapToResponseDto(complaint));
        }

        // GET: api/complaints/analytics - Get complaint analytics
        [HttpGet("analytics")]
        public async Task<ActionResult<ComplaintAnalyticsDto>> GetAnalytics()
        {
            var analytics = await _complaintService.GetAnalytics();
            return Ok(analytics);
        }

        // GET: api/complaints/{id} - Get complaint by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<ComplaintResponseDto>> GetComplaint(int id)
        {
            var complaint = await _complaintService.GetComplaintById(id);
            if (complaint == null)
                return NotFound();

            return Ok(MapToResponseDto(complaint));
        }

        // GET: api/complaints - Get all complaints
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ComplaintResponseDto>>> GetAllComplaints()
        {
            var complaints = await _complaintService.GetAllComplaints();
            var response = complaints.Select(MapToResponseDto);
            return Ok(response);
        }

        // PUT: api/complaints/{id}/status - Update complaint status
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/status")]
        public async Task<ActionResult<ComplaintResponseDto>> UpdateStatus(int id, [FromBody] string status)
        {
            var complaint = await _complaintService.UpdateComplaintStatus(id, status);
            if (complaint == null)
                return NotFound();

            return Ok(MapToResponseDto(complaint));
        }

        // POST: api/complaints/{id}/comments - Add comment to complaint
        [HttpPost("{id}/comments")]
        public async Task<ActionResult<CommentDto>> AddComment(int id, AddCommentDto dto)
        {
            var comment = new ComplaintComments
            {
                CommentText = dto.CommentText,
                CommentedBy = dto.CommentedBy ?? "Anonymous"
            };

            var created = await _complaintService.AddComment(id, comment);

            return Ok(new CommentDto
            {
                CommentId = created.CommentId,
                CommentText = created.CommentText,
                CommentedBy = created.CommentedBy,
                CommentedOn = created.CommentedOn
            });
        }


        // DELETE: api/complaints/{id} - Delete complaint (Admin)
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComplaint(int id)
        {
            var deleted = await _complaintService.DeleteComplaint(id);
            if (!deleted) return NotFound();

            return NoContent();
        }

        // Helper method to map Complaint to ComplaintResponseDto
        private ComplaintResponseDto MapToResponseDto(Complaint complaint)
        {
            return new ComplaintResponseDto
            {
                ComplaintId = complaint.ComplaintId,
                TicketNumber = complaint.TicketNumber,
                Category = complaint.Category,
                Description = complaint.Description,
                Priority = complaint.Priority,
                Status = complaint.Status,
                ContactName = complaint.ContactName,
                CreatedOn = complaint.CreatedOn,
                UpdatedOn = complaint.UpdatedOn,
                Comments = complaint.Comments.Select(c => new CommentDto
                {
                    CommentId = c.CommentId,
                    CommentText = c.CommentText,
                    CommentedBy = c.CommentedBy,
                    CommentedOn = c.CommentedOn
                }).ToList(),
                Attachments = complaint.Attachments.Select(a => new AttachmentDto
                {
                    AttachmentId = a.AttachmentId,
                    FileName = a.FileName,
                    FilePath = a.FilePath,
                    FileType = a.FileType,
                    FileSize = a.FileSize
                }).ToList()
            };
        }
    }
}
