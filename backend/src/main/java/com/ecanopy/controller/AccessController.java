package com.ecanopy.controller;

import com.ecanopy.service.AccessService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/access")
@RequiredArgsConstructor
public class AccessController {

    private final AccessService accessService;

    @PostMapping("/validate-qr")
    @PreAuthorize("hasRole('SECURITY_GUARD') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> validateQr(@RequestBody Map<String, String> request,
            @AuthenticationPrincipal UserDetails userDetails) {
        String token = request.get("token");
        String scannedBy = userDetails.getUsername();
        return ResponseEntity.ok(accessService.validateQr(token, scannedBy));
    }
}
