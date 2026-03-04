package com.ecanopy.service;

import com.ecanopy.dto.request.NoticeRequest;
import com.ecanopy.dto.response.NoticeResponse;
import com.ecanopy.entity.Notice;
import com.ecanopy.entity.Society;
import com.ecanopy.entity.User;
import com.ecanopy.entity.enums.Priority;
import com.ecanopy.exception.NotFoundException;
import com.ecanopy.repository.NoticeRepository;
import com.ecanopy.repository.SocietyRepository;
import com.ecanopy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NoticeService {

    private final NoticeRepository noticeRepository;
    private final SocietyRepository societyRepository;
    private final UserRepository userRepository;
    private final AuthService authService;

    @Transactional
    public NoticeResponse createNotice(Long societyId, NoticeRequest request) {
        User currentUser = userRepository.findByEmail(authService.getCurrentUser().getEmail())
                .orElseThrow(() -> new NotFoundException("User not found"));

        Society society = societyRepository.findById(societyId)
                .orElseThrow(() -> new NotFoundException("Society not found"));

        Notice notice = new Notice();
        notice.setTitle(request.getTitle());
        notice.setContent(request.getContent());
        notice.setNoticeType(request.getNoticeType());
        notice.setPriority(request.getPriority());
        notice.setCreatedAt(LocalDateTime.now());
        notice.setPublishedByUser(currentUser);
        notice.setSociety(society);
        notice.setIsActive(true);

        Notice savedNotice = noticeRepository.save(notice);
        return mapToNoticeResponse(savedNotice);
    }

    public List<NoticeResponse> getNoticesBySociety(Long societyId) {
        return noticeRepository.findBySocietySocietyIdAndIsActiveTrueOrderByCreatedAtDesc(societyId).stream()
                .map(this::mapToNoticeResponse)
                .collect(Collectors.toList());
    }

    private NoticeResponse mapToNoticeResponse(Notice notice) {
        return NoticeResponse.builder()
                .noticeId(notice.getNoticeId())
                .title(notice.getTitle())
                .content(notice.getContent())
                .type(notice.getNoticeType())
                .isUrgent(notice.getPriority() == Priority.HIGH)
                .createdAt(notice.getCreatedAt())
                .postedById(notice.getPublishedByUser().getId())
                .postedByName(notice.getPublishedByUser().getFullName())
                .build();
    }

    public void deleteNotice(Long noticeId) {
        if (!noticeRepository.existsById(noticeId)) {
            throw new NotFoundException("Notice not found");
        }
        noticeRepository.deleteById(noticeId);
    }
}
