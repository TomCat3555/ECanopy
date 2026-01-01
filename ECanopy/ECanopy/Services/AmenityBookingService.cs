using ECanopy.Data;
using ECanopy.DTO;
using ECanopy.Models;
using ECanopy.Common;
using ECanopy.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ECanopy.Services
{
    public class AmenityBookingService : IAmenityBookingService
    {
        private readonly ApplicationDbContext _context;

        public AmenityBookingService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<AmenityBookingResponseDto> CreateAsync(string userId, CreateAmenityBookingDto dto)
        {
            var resident = await _context.Residents
                .FirstOrDefaultAsync(r => r.UserId == userId);

            if (resident == null)
                throw new BusinessException("Resident profile not found");

            var amenity = await _context.Amenities
                .FirstOrDefaultAsync(a => a.AmenityId == dto.AmenityId);

            if (amenity == null)
                throw new NotFoundException("Amenity not found");

            // Check if time slot is already booked
            var existingBooking = await _context.AmenityBookings
                .FirstOrDefaultAsync(b =>
                    b.AmenityId == dto.AmenityId &&
                    b.BookingDate.Date == dto.BookingDate.Date &&
                    b.Status == "Approved" &&
                    b.StartTime == dto.StartTime);

            if (existingBooking != null)
                throw new BusinessException("This time slot is already booked");

            var booking = new AmenityBooking
            {
                AmenityId = dto.AmenityId,
                ResidentId = resident.ResidentId,
                BookingDate = dto.BookingDate,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
                NumberOfGuests = dto.NumberOfGuests,
                Status = "Pending",
                RequestedAt = DateTime.UtcNow,
                Notes = dto.Notes
            };

            _context.AmenityBookings.Add(booking);
            await _context.SaveChangesAsync();

            var savedBooking = await _context.AmenityBookings
                .Include(b => b.Amenity)
                .Include(b => b.Resident)
                .FirstOrDefaultAsync(b => b.AmenityBookingId == booking.AmenityBookingId);

            if (savedBooking == null)
                throw new NotFoundException("Booking not found");

            return new AmenityBookingResponseDto
            {
                AmenityBookingId = savedBooking.AmenityBookingId,
                AmenityId = savedBooking.AmenityId,
                AmenityName = savedBooking.Amenity.AmenityName,
                ResidentId = savedBooking.ResidentId,
                ResidentName = savedBooking.Resident.FullName,
                BookingDate = savedBooking.BookingDate,
                StartTime = savedBooking.StartTime,
                EndTime = savedBooking.EndTime,
                NumberOfGuests = savedBooking.NumberOfGuests,
                Status = savedBooking.Status,
                RequestedAt = savedBooking.RequestedAt,
                ApprovedAt = savedBooking.ApprovedAt,
                Notes = savedBooking.Notes
            };
        }

        public async Task<IEnumerable<AmenityBookingResponseDto>> GetMyBookingsAsync(string userId)
        {
            var resident = await _context.Residents
                .FirstOrDefaultAsync(r => r.UserId == userId);

            if (resident == null)
                throw new BusinessException("Resident profile not found");

            return await _context.AmenityBookings
                .Where(b => b.ResidentId == resident.ResidentId)
                .Include(b => b.Amenity)
                .Include(b => b.Resident)
                .OrderByDescending(b => b.BookingDate)
                .ThenByDescending(b => b.RequestedAt)
                .Select(b => new AmenityBookingResponseDto
                {
                    AmenityBookingId = b.AmenityBookingId,
                    AmenityId = b.AmenityId,
                    AmenityName = b.Amenity.AmenityName,
                    ResidentId = b.ResidentId,
                    ResidentName = b.Resident.FullName,
                    BookingDate = b.BookingDate,
                    StartTime = b.StartTime,
                    EndTime = b.EndTime,
                    NumberOfGuests = b.NumberOfGuests,
                    Status = b.Status,
                    RequestedAt = b.RequestedAt,
                    ApprovedAt = b.ApprovedAt,
                    Notes = b.Notes
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<AmenityBookingResponseDto>> GetPendingBookingsAsync(int societyId)
        {
            return await _context.AmenityBookings
                .Where(b =>
                    b.Amenity.SocietyId == societyId &&
                    b.Status == "Pending")
                .Include(b => b.Amenity)
                .Include(b => b.Resident)
                .OrderBy(b => b.BookingDate)
                .ThenBy(b => b.StartTime)
                .Select(b => new AmenityBookingResponseDto
                {
                    AmenityBookingId = b.AmenityBookingId,
                    AmenityId = b.AmenityId,
                    AmenityName = b.Amenity.AmenityName,
                    ResidentId = b.ResidentId,
                    ResidentName = b.Resident.FullName,
                    BookingDate = b.BookingDate,
                    StartTime = b.StartTime,
                    EndTime = b.EndTime,
                    NumberOfGuests = b.NumberOfGuests,
                    Status = b.Status,
                    RequestedAt = b.RequestedAt,
                    ApprovedAt = b.ApprovedAt,
                    Notes = b.Notes
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<AmenityBookingResponseDto>> GetAllBookingsAsync(int societyId)
        {
            return await _context.AmenityBookings
                .Where(b => b.Amenity.SocietyId == societyId)
                .Include(b => b.Amenity)
                .Include(b => b.Resident)
                .OrderByDescending(b => b.BookingDate)
                .ThenByDescending(b => b.RequestedAt)
                .Select(b => new AmenityBookingResponseDto
                {
                    AmenityBookingId = b.AmenityBookingId,
                    AmenityId = b.AmenityId,
                    AmenityName = b.Amenity.AmenityName,
                    ResidentId = b.ResidentId,
                    ResidentName = b.Resident.FullName,
                    BookingDate = b.BookingDate,
                    StartTime = b.StartTime,
                    EndTime = b.EndTime,
                    NumberOfGuests = b.NumberOfGuests,
                    Status = b.Status,
                    RequestedAt = b.RequestedAt,
                    ApprovedAt = b.ApprovedAt,
                    Notes = b.Notes
                })
                .ToListAsync();
        }

        public async Task ApproveAsync(int bookingId, string approvedByUserId)
        {
            var booking = await _context.AmenityBookings
                .FirstOrDefaultAsync(b => b.AmenityBookingId == bookingId);

            if (booking == null)
                throw new NotFoundException("Booking not found");

            booking.Status = "Approved";
            booking.ApprovedAt = DateTime.UtcNow;
            booking.ApprovedByUserId = approvedByUserId;

            await _context.SaveChangesAsync();
        }

        public async Task RejectAsync(int bookingId, string approvedByUserId)
        {
            var booking = await _context.AmenityBookings
                .FirstOrDefaultAsync(b => b.AmenityBookingId == bookingId);

            if (booking == null)
                throw new NotFoundException("Booking not found");

            booking.Status = "Rejected";
            booking.ApprovedAt = DateTime.UtcNow;
            booking.ApprovedByUserId = approvedByUserId;

            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<TimeSpan>> GetAvailableTimeSlotsAsync(int amenityId, DateTime date)
        {
            // Get booked time slots for this date
            var bookedSlots = await _context.AmenityBookings
                .Where(b =>
                    b.AmenityId == amenityId &&
                    b.BookingDate.Date == date.Date &&
                    b.Status == "Approved")
                .Select(b => b.StartTime)
                .ToListAsync();

            // Generate time slots from 6 AM to 10 PM (hourly)
            var allSlots = new List<TimeSpan>();
            for (int hour = 6; hour < 22; hour++)
            {
                allSlots.Add(TimeSpan.FromHours(hour));
            }

            // Return slots that are not booked
            return allSlots.Where(slot => !bookedSlots.Contains(slot));
        }

    }
}

