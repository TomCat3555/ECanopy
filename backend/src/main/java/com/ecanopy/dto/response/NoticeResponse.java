package com.ecanopy.dto.response;

import com.ecanopy.entity.enums.NoticeType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class NoticeResponse {
    private Long noticeId;
    private String title;
    private String content;
    private NoticeType type;
    private Boolean isUrgent;
    private LocalDateTime createdAt;
    private Long postedById;
    private String postedByName;
}
