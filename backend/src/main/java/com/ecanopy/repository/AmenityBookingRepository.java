package com.ecanopy.repository;

import com.ecanopy.entity.AmenityBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AmenityBookingRepository extends JpaRepository<AmenityBooking, Long> {
        List<AmenityBooking> findByResidentResidentIdOrderByBookingDateDesc(Long residentId);

        List<AmenityBooking> findByAmenityAmenityId(Long amenityId);

        List<AmenityBooking> findByAmenity_Society_SocietyIdOrderByBookingDateDesc(Long societyId);

        @org.springframework.data.jpa.repository.Query("SELECT b FROM AmenityBooking b WHERE b.amenity.amenityId = :amenityId "
                        +
                        "AND b.bookingDate = :bookingDate " +
                        "AND b.status != 'REJECTED' " +
                        "AND b.startTime < :endTime AND b.endTime > :startTime")
        List<AmenityBooking> findOverlappingBookings(
                        @org.springframework.data.repository.query.Param("amenityId") Long amenityId,
                        @org.springframework.data.repository.query.Param("bookingDate") java.time.LocalDate bookingDate,
                        @org.springframework.data.repository.query.Param("startTime") java.time.LocalTime startTime,
                        @org.springframework.data.repository.query.Param("endTime") java.time.LocalTime endTime);
}
