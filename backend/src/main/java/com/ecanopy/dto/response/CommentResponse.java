package com.ecanopy.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class CommentResponse {
    private Long id;
    private String comment;
    private Long authorId;
    private String authorName;
    private String authorRole; // e.g., "Resident" or "Secretary"
    private LocalDateTime createdAt;
    private boolean isInternal;
}
