package com.ecanopy.repository;

import com.ecanopy.entity.ComplaintAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintAttachmentRepository extends JpaRepository<ComplaintAttachment, Long> {
    List<ComplaintAttachment> findByComplaintComplaintId(Long complaintId);
}
