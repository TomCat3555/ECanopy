package com.ecanopy.dto.request;

import com.ecanopy.entity.enums.NoticeType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class NoticeRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Content is required")
    private String content;

    @NotNull(message = "Notice Type is required")
    private NoticeType noticeType;

    @NotNull(message = "Priority is required")
    private com.ecanopy.entity.enums.Priority priority;
}
