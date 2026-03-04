package com.ecanopy.controller;

import com.ecanopy.dto.request.NoticeRequest;
import com.ecanopy.dto.response.NoticeResponse;
import com.ecanopy.service.NoticeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notices")
@RequiredArgsConstructor
@Tag(name = "Notice Board", description = "Endpoints for digital notice board")
public class NoticeController {

    private final NoticeService noticeService;

    @PostMapping("/society/{societyId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RWA_PRESIDENT') or hasRole('RWA_SECRETARY')")
    @Operation(summary = "Post Notice", description = "Post a new notice to the notice board")
    public ResponseEntity<NoticeResponse> createNotice(@PathVariable Long societyId,
            @Valid @RequestBody NoticeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(noticeService.createNotice(societyId, request));
    }

    @GetMapping("/society/{societyId}")
    @Operation(summary = "Get Notices", description = "Get active notices for a society")
    public ResponseEntity<List<NoticeResponse>> getNotices(@PathVariable Long societyId) {
        return ResponseEntity.ok(noticeService.getNoticesBySociety(societyId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RWA_PRESIDENT')")
    @Operation(summary = "Delete Notice", description = "Delete a notice")
    public ResponseEntity<Void> deleteNotice(@PathVariable Long id) {
        noticeService.deleteNotice(id);
        return ResponseEntity.noContent().build();
    }
}
