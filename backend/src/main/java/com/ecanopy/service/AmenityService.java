package com.ecanopy.service;

import com.ecanopy.entity.Amenity;
import com.ecanopy.entity.AmenityBooking;
import com.ecanopy.entity.User;
import com.ecanopy.exception.NotFoundException;
import com.ecanopy.repository.AmenityBookingRepository;
import com.ecanopy.repository.AmenityRepository;
import com.ecanopy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AmenityService {

    private final com.ecanopy.repository.SocietyRepository societyRepository;
    private final AmenityRepository amenityRepository;
    private final AmenityBookingRepository amenityBookingRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public List<Amenity> getAllAmenities(Long societyId) {
        List<Amenity> amenities = amenityRepository.findBySocietySocietyId(societyId);
        if (amenities.isEmpty()) {
            return seedDefaultAmenities(societyId);
        }
        return amenities;
    }

    @Transactional
    public List<Amenity> getAllAmenitiesByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        Long societyId = user.getSocietyId();
        if (societyId == null && user.getResident() != null && user.getResident().getFlat() != null) {
            societyId = user.getResident().getFlat().getBuilding().getSociety().getSocietyId();
        }
        if (societyId == null) {
            return java.util.Collections.emptyList();
        }
        return getAllAmenities(societyId);
    }

    private List<Amenity> seedDefaultAmenities(Long societyId) {
        com.ecanopy.entity.Society society = societyRepository.findById(societyId)
                .orElseThrow(() -> new NotFoundException("Society not found"));

        Amenity swimmingPool = Amenity.builder()
                .amenityName("Swimming Pool")
                .description("Olympic size swimming pool with temperature control.")
                .capacity(50)
                .rules("Wear proper swimwear. Shower before entering.")
                .imageUrl("https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800&h=600&fit=crop")
                .isActive(true)
                .society(society)
                .build();

        Amenity gym = Amenity.builder()
                .amenityName("Gymnasium")
                .description("Fully equipped gym with cardio and weight sections.")
                .capacity(30)
                .rules("Carry your own towel. Wipe equipment after use.")
                .imageUrl("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop")
                .isActive(true)
                .society(society)
                .build();

        Amenity clubHouse = Amenity.builder()
                .amenityName("Clubhouse Hall")
                .description("Spacious hall for parties and events.")
                .capacity(100)
                .rules("No loud music after 10 PM.")
                .imageUrl("https://images.unsplash.com/photo-1519167758481-83f29da8c2b0?w=800&h=600&fit=crop")
                .isActive(true)
                .society(society)
                .build();

        Amenity tennisCourt = Amenity.builder()
                .amenityName("Tennis Court")
                .description("Synthetic hard court.")
                .capacity(4)
                .rules("Non-marking shoes mandatory.")
                .imageUrl("https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=600&fit=crop")
                .isActive(true)
                .society(society)
                .build();

        return amenityRepository.saveAll(java.util.Arrays.asList(swimmingPool, gym, clubHouse, tennisCourt));
    }

    public List<Amenity> getAllAmenities() {
        return amenityRepository.findAll();
    }

    public List<com.ecanopy.dto.response.AmenityBookingResponse> getAllBookings(Long societyId) {
        return amenityBookingRepository.findByAmenity_Society_SocietyIdOrderByBookingDateDesc(societyId).stream()
                .map(this::mapToBookingResponse)
                .toList();
    }

    public List<AmenityBooking> getAllBookingsEntity(Long societyId) {
        return amenityBookingRepository.findByAmenity_Society_SocietyIdOrderByBookingDateDesc(societyId);
    }

    public Amenity addAmenity(Amenity amenity, Long societyId) {
        com.ecanopy.entity.Society society = societyRepository.findById(societyId)
                .orElseThrow(() -> new NotFoundException("Society not found"));
        amenity.setSociety(society);
        return amenityRepository.save(amenity);
    }

    public Amenity addAmenity(Amenity amenity) {
        return amenityRepository.save(amenity);
    }

    @Transactional
    public AmenityBooking bookAmenity(Long amenityId, Long userId, LocalDateTime startTime, LocalDateTime endTime) {
        // 1. Basic time validation
        if (startTime.isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Cannot book amenity for a past date or time");
        }
        if (startTime.isAfter(endTime) || startTime.isEqual(endTime)) {
            throw new RuntimeException("Start time must be before end time");
        }
        if (!startTime.toLocalDate().equals(endTime.toLocalDate())) {
            throw new RuntimeException(
                    "Amenities can only be booked for a single day. Please create separate bookings for multiple days.");
        }

        // 2. Fetch and validate amenity
        Amenity amenity = amenityRepository.findById(amenityId)
                .orElseThrow(() -> new NotFoundException("Amenity not found"));

        if (amenity.getIsActive() != null && !amenity.getIsActive()) {
            throw new RuntimeException("This amenity is currently unavailable for booking");
        }

        // 3. Fetch and validate user/resident
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        if (user.getResident() == null) {
            throw new RuntimeException("Only residents can book amenities. Please complete your profile first.");
        }

        // 4. Overlap Check
        List<AmenityBooking> overlapping = amenityBookingRepository.findOverlappingBookings(
                amenityId,
                startTime.toLocalDate(),
                startTime.toLocalTime(),
                endTime.toLocalTime());

        if (!overlapping.isEmpty()) {
            throw new RuntimeException("This time slot is already booked or pending approval.");
        }

        // 5. Create booking
        AmenityBooking booking = AmenityBooking.builder()
                .amenity(amenity)
                .resident(user.getResident())
                .approvedByUser(null)
                .bookingDate(startTime.toLocalDate())
                .startTime(startTime.toLocalTime())
                .endTime(endTime.toLocalTime())
                .status(com.ecanopy.entity.enums.BookingStatus.PENDING)
                .build();

        return amenityBookingRepository.save(booking);
    }

    @Transactional
    public Amenity updateAmenity(Long amenityId, Amenity updatedAmenity) {
        Amenity amenity = amenityRepository.findById(amenityId)
                .orElseThrow(() -> new NotFoundException("Amenity not found"));

        amenity.setAmenityName(updatedAmenity.getAmenityName());
        amenity.setDescription(updatedAmenity.getDescription());
        amenity.setCapacity(updatedAmenity.getCapacity());
        amenity.setRules(updatedAmenity.getRules());
        amenity.setImageUrl(updatedAmenity.getImageUrl());

        if (updatedAmenity.getIsActive() != null) {
            amenity.setIsActive(updatedAmenity.getIsActive());
        }

        return amenityRepository.save(amenity);
    }

    public void deleteAmenity(Long amenityId) {
        if (!amenityRepository.existsById(amenityId)) {
            throw new NotFoundException("Amenity not found");
        }
        amenityRepository.deleteById(amenityId);
    }

    @Transactional
    public com.ecanopy.dto.response.AmenityBookingResponse updateBookingStatus(Long bookingId, String status,
            String approvedByEmail) {
        AmenityBooking booking = amenityBookingRepository.findById(bookingId)
                .orElseThrow(() -> new NotFoundException("Booking not found"));

        User approver = userRepository.findByEmail(approvedByEmail).orElse(null);

        booking.setStatus(com.ecanopy.entity.enums.BookingStatus.valueOf(status.toUpperCase()));
        booking.setApprovedAt(LocalDateTime.now());
        booking.setApprovedByUser(approver);

        AmenityBooking saved = amenityBookingRepository.save(booking);

        if (saved.getResident() != null && saved.getResident().getUser() != null) {
            String toEmail = saved.getResident().getUser().getEmail();
            String residentName = saved.getResident().getUser().getFullName();
            String amenityName = saved.getAmenity() != null ? saved.getAmenity().getAmenityName() : "Amenity";
            String bookingDate = saved.getBookingDate().toString();
            String bookingTime = saved.getStartTime() + " - " + saved.getEndTime();

            emailService.sendBookingStatusEmail(
                    toEmail,
                    residentName,
                    amenityName,
                    saved.getStatus().name(),
                    bookingDate,
                    bookingTime);
        }

        return mapToBookingResponse(saved);
    }

    public com.ecanopy.dto.response.AmenityBookingResponse updateBookingStatus(Long bookingId, String status) {
        return updateBookingStatus(bookingId, status, (String) null);
    }

    public List<com.ecanopy.dto.response.AmenityBookingResponse> getMyBookings(Long residentId) {
        return amenityBookingRepository.findByResidentResidentIdOrderByBookingDateDesc(residentId).stream()
                .map(this::mapToBookingResponse)
                .toList();
    }

    public List<com.ecanopy.dto.response.AmenityBookingResponse> getMyBookingsByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));
        if (user.getResident() == null)
            throw new NotFoundException("Resident profile not found");
        return getMyBookings(user.getResident().getResidentId());
    }

    private com.ecanopy.dto.response.AmenityBookingResponse mapToBookingResponse(AmenityBooking booking) {
        String residentName = "Unknown";
        String flatNumber = "N/A";

        if (booking.getResident() != null) {
            if (booking.getResident().getUser() != null) {
                residentName = booking.getResident().getUser().getFullName();
            } else {
                residentName = booking.getResident().getFullName();
            }

            if (booking.getResident().getFlat() != null) {
                flatNumber = booking.getResident().getFlat().getFlatNumber();
            }
        }

        return com.ecanopy.dto.response.AmenityBookingResponse.builder()
                .bookingId(booking.getAmenityBookingId())
                .amenityName(booking.getAmenity() != null ? booking.getAmenity().getAmenityName() : "Unknown Amenity")
                .residentName(residentName)
                .flatNumber(flatNumber)
                .startTime(LocalDateTime.of(booking.getBookingDate(), booking.getStartTime()))
                .endTime(LocalDateTime.of(booking.getBookingDate(), booking.getEndTime()))
                .status(booking.getStatus().name())
                .approvedBy(booking.getApprovedByUser() != null ? booking.getApprovedByUser().getFullName() : null)
                .build();
    }
}
