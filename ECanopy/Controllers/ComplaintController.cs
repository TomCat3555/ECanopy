using ECanopy.Data;
using ECanopy.DTO;
using ECanopy.Models;
using ECanopy.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using static ECanopy.DTO.ComplaintDtos;

namespace ECanopy.Controllers
{
    [ApiController]
    [Route("api/complaints")]
    public class ComplaintsController : ControllerBase
    {
        private readonly IComplaintService _complaintService;

        public ComplaintsController(IComplaintService complaintService)
        {
            _complaintService = complaintService;
        }

        // ===============================
        // CREATE COMPLAINT (PUBLIC)
        // ===============================
        [HttpPost]
        public async Task<ActionResult<ComplaintResponseDto>> CreateComplaint(
            CreateComplaintDto dto)
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

            return CreatedAtAction(
                nameof(GetByTicket),
                new { ticketNumber = created.TicketNumber },
                MapToResponseDto(created));
        }

        // ===============================
        // TRACK COMPLAINT BY TICKET
        // ===============================
        [HttpGet("track/{ticketNumber}")]
        public async Task<ActionResult<ComplaintResponseDto>> GetByTicket(
            string ticketNumber)
        {
            var complaint =
                await _complaintService.GetComplaintByTicketNumber(ticketNumber);

            if (complaint == null)
                return NotFound(new { message = "Complaint not found" });

            return Ok(MapToResponseDto(complaint));
        }

        // ===============================
        // ADD COMMENT (NO IDS)
        // ===============================
        [HttpPost("track/{ticketNumber}/comments")]
        public async Task<ActionResult<CommentDto>> AddComment(
            string ticketNumber,
            AddCommentDto dto)
        {
            var comment = new ComplaintComments
            {
                CommentText = dto.CommentText,
            };

            var created =
                await _complaintService.AddCommentByTicket(ticketNumber, comment);

            return Ok(new CommentDto
            {
                CommentText = created.CommentText,
                CommentedOn = created.CommentedOn
            });
        }

        // ===============================
        // UPDATE STATUS (ADMIN ONLY)
        // ===============================
        [Authorize(Roles = "Admin")]
        [HttpPut("track/{ticketNumber}/status")]
        public async Task<ActionResult<ComplaintResponseDto>> UpdateStatus(
            string ticketNumber,
            [FromBody] string status)
        {
            var complaint =
                await _complaintService.UpdateComplaintStatusByTicket(
                    ticketNumber,
                    status);

            if (complaint == null)
                return NotFound();

            return Ok(MapToResponseDto(complaint));
        }

        // ===============================
        // DELETE COMPLAINT (ADMIN ONLY)
        // ===============================
        [Authorize(Roles = "Admin")]
        [HttpDelete("track/{ticketNumber}")]
        public async Task<IActionResult> DeleteComplaint(string ticketNumber)
        {
            var deleted =
                await _complaintService.DeleteByTicket(ticketNumber);

            if (!deleted)
                return NotFound();

            return NoContent();
        }

        // ===============================
        // ANALYTICS (ADMIN)
        // ===============================
        [Authorize(Roles = "Admin")]
        [HttpGet("analytics")]
        public async Task<ActionResult<ComplaintAnalyticsDto>> Analytics()
        {
            return Ok(await _complaintService.GetAnalytics());
        }


        private ComplaintResponseDto MapToResponseDto(Complaint complaint)
        {
            return new ComplaintResponseDto
            {
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
                    CommentText = c.CommentText,
                    CommentedOn = c.CommentedOn
                }).ToList(),
                Attachments = complaint.Attachments.Select(a => new AttachmentDto
                {
                    FileName = a.FileName,
                    FilePath = a.FilePath,
                    FileType = a.FileType,
                    FileSize = a.FileSize
                }).ToList()
            };
        }
    }
}
