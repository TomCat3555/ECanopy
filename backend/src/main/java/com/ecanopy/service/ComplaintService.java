package com.ecanopy.service;

import com.ecanopy.dto.request.ComplaintRequest;
import com.ecanopy.dto.response.ComplaintResponse;
import com.ecanopy.dto.response.UserResponse;
import com.ecanopy.entity.Complaint;
import com.ecanopy.entity.Resident;
import com.ecanopy.entity.User;
import com.ecanopy.entity.enums.ComplaintStatus;
import com.ecanopy.entity.enums.Priority;
import com.ecanopy.exception.NotFoundException;
import com.ecanopy.dto.request.CommentRequest;
import com.ecanopy.dto.response.CommentResponse;
import com.ecanopy.entity.ComplaintComment;
import com.ecanopy.repository.ComplaintCommentRepository;
import com.ecanopy.repository.ComplaintRepository;
import com.ecanopy.repository.ResidentRepository;
import com.ecanopy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ComplaintService {

        private final ComplaintRepository complaintRepository;
        private final ComplaintCommentRepository complaintCommentRepository;
        private final ResidentRepository residentRepository;
        private final UserRepository userRepository;
        private final AuthService authService; // To get current user

        @Transactional
        public ComplaintResponse createComplaint(ComplaintRequest request) {
                User currentUser = userRepository.findByEmail(authService.getCurrentUser().getEmail())
                                .orElseThrow(() -> new NotFoundException("User not found"));

                // Find resident profile associated with user
                Resident resident = residentRepository.findByUserId(currentUser.getId())
                                .orElseThrow(() -> new NotFoundException(
                                                "Resident profile not found for current user"));

                Complaint complaint = new Complaint();
                complaint.setTitle(request.getTitle());
                complaint.setDescription(request.getDescription());
                complaint.setCategory(request.getCategory());
                complaint.setPriority(Priority.valueOf(request.getPriority()));
                complaint.setStatus(ComplaintStatus.OPEN);
                complaint.setTicketNumber("TKT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
                complaint.setCreatedAt(LocalDateTime.now());
                complaint.setResident(resident);

                Complaint savedComplaint = complaintRepository.save(complaint);
                return mapToComplaintResponse(savedComplaint);
        }

        public List<ComplaintResponse> getMyComplaints() {
                User currentUser = userRepository.findByEmail(authService.getCurrentUser().getEmail())
                                .orElseThrow(() -> new NotFoundException("User not found"));

                Resident resident = residentRepository.findByUserId(currentUser.getId())
                                .orElseThrow(() -> new NotFoundException("Resident profile not found"));

                return complaintRepository.findByResidentResidentId(resident.getResidentId()).stream()
                                .map(this::mapToComplaintResponse)
                                .collect(Collectors.toList());
        }

        public List<ComplaintResponse> getAllComplaints() {
                return complaintRepository.findAll().stream()
                                .map(this::mapToComplaintResponse)
                                .collect(Collectors.toList());
        }

        public List<ComplaintResponse> getComplaintsBySociety(Long societyId) {
                return complaintRepository.findByResident_Flat_Building_Society_SocietyId(societyId).stream()
                                .map(this::mapToComplaintResponse)
                                .collect(Collectors.toList());
        }

        @Transactional
        public ComplaintResponse updateStatus(Long id, String status) {
                Complaint complaint = complaintRepository.findById(id)
                                .orElseThrow(() -> new NotFoundException("Complaint not found"));

                complaint.setStatus(ComplaintStatus.valueOf(status));
                return mapToComplaintResponse(complaintRepository.save(complaint));
        }

        private ComplaintResponse mapToComplaintResponse(Complaint complaint) {
                UserResponse currentUser = authService.getCurrentUser();
                boolean hasUnread = false;

                // Determine unread status based on role
                if (currentUser.getRoles().contains("ROLE_RESIDENT")) {
                        hasUnread = complaint.isUnreadByResident();
                } else {
                        hasUnread = complaint.isUnreadByStaff();
                }

                return ComplaintResponse.builder()
                                .complaintId(complaint.getComplaintId())
                                .ticketNumber(complaint.getTicketNumber())
                                .title(complaint.getTitle())
                                .description(complaint.getDescription())
                                .status(complaint.getStatus())
                                .priority(complaint.getPriority())
                                .category(complaint.getCategory())
                                .createdAt(complaint.getCreatedAt())
                                .residentId(complaint.getResident().getResidentId())
                                .residentName(complaint.getResident().getUser().getFullName())
                                .flatNumber(complaint.getResident().getFlat().getFlatNumber())
                                .hasUnreadMessages(hasUnread)
                                .build();
        }

        @Transactional
        public CommentResponse addComment(Long complaintId, CommentRequest request) {
                Complaint complaint = complaintRepository.findById(complaintId)
                                .orElseThrow(() -> new NotFoundException("Complaint not found"));

                User currentUser = userRepository.findByEmail(authService.getCurrentUser().getEmail())
                                .orElseThrow(() -> new NotFoundException("User not found"));

                ComplaintComment comment = ComplaintComment.builder()
                                .complaint(complaint)
                                .user(currentUser)
                                .comment(request.getComment())
                                .createdAt(LocalDateTime.now())
                                .isInternal(false) // Public by default
                                .build();

                // Set unread flags
                boolean isResident = currentUser.getRoles().stream().anyMatch(r -> r.getName().equals("ROLE_RESIDENT"));
                if (isResident) {
                        complaint.setUnreadByStaff(true);
                } else {
                        complaint.setUnreadByResident(true);
                }
                complaintRepository.save(complaint);

                ComplaintComment savedComment = complaintCommentRepository.save(comment);
                return mapToCommentResponse(savedComment);
        }

        @Transactional
        public List<CommentResponse> getComments(Long complaintId) {
                Complaint complaint = complaintRepository.findById(complaintId)
                                .orElseThrow(() -> new NotFoundException("Complaint not found"));

                UserResponse currentUser = authService.getCurrentUser();

                // Clear unread flag for the viewer
                boolean isResident = currentUser.getRoles().contains("ROLE_RESIDENT");
                if (isResident) {
                        complaint.setUnreadByResident(false);
                } else {
                        complaint.setUnreadByStaff(false);
                }
                complaintRepository.save(complaint);

                return complaintCommentRepository.findByComplaintComplaintIdOrderByCreatedAtDesc(complaintId).stream()
                                .map(this::mapToCommentResponse)
                                .collect(Collectors.toList());
        }

        private CommentResponse mapToCommentResponse(ComplaintComment comment) {
                String role = comment.getUser().getRoles().stream()
                                .findFirst()
                                .map(r -> r.getName().replace("ROLE_", ""))
                                .orElse("Unknown");

                return CommentResponse.builder()
                                .id(comment.getComplaintCommentId())
                                .comment(comment.getComment())
                                .authorId(comment.getUser().getId())
                                .authorName(comment.getUser().getFullName())
                                .authorRole(role)
                                .createdAt(comment.getCreatedAt())
                                .isInternal(comment.getIsInternal())
                                .build();
        }
}
