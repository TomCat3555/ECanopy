package com.ecanopy.repository;

import com.ecanopy.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecanopy.entity.enums.ComplaintStatus;
import java.util.List;
import java.util.Optional;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    Optional<Complaint> findByTicketNumber(String ticketNumber);

    List<Complaint> findByResidentResidentId(Long residentId);

    List<Complaint> findByResident_Flat_Building_Society_SocietyId(Long societyId);

    long countByStatus(ComplaintStatus status);

    long countByResident_Flat_Building_Society_SocietyIdAndStatus(Long societyId, ComplaintStatus status);
}
