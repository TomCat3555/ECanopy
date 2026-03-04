package com.ecanopy.controller;

import com.ecanopy.dto.request.LoginRequest;
import com.ecanopy.dto.request.RegisterRequest;
import com.ecanopy.dto.response.JwtAuthenticationResponse;
import com.ecanopy.dto.response.UserResponse;
import com.ecanopy.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication endpoints")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user", description = "Register a new user and return JWT token")
    public ResponseEntity<JwtAuthenticationResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/login")
    @Operation(summary = "Login", description = "Authenticate user and return JWT token")
    public ResponseEntity<JwtAuthenticationResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current user", description = "Get currently authenticated user details")
    public ResponseEntity<UserResponse> getCurrentUser() {
        UserResponse user = authService.getCurrentUser();
        return ResponseEntity.ok(user);
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Forgot Password", description = "Request a password reset link")
    public ResponseEntity<String> forgotPassword(@RequestBody java.util.Map<String, String> request) {
        String email = request.get("email");
        authService.forgotPassword(email);
        return ResponseEntity.ok("If an account exists with this email, a reset link has been sent.");
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset Password", description = "Reset password using token")
    public ResponseEntity<String> resetPassword(@RequestBody java.util.Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");
        authService.resetPassword(token, newPassword);
        return ResponseEntity.ok("Password reset successfully. You can now login.");
    }
}
