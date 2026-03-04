package com.ecanopy.repository;

import com.ecanopy.entity.ComplaintComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintCommentRepository extends JpaRepository<ComplaintComment, Long> {
    List<ComplaintComment> findByComplaintComplaintId(Long complaintId);

    List<ComplaintComment> findByComplaintComplaintIdOrderByCreatedAtDesc(Long complaintId);
}
