package com.ecanopy.service;

import com.ecanopy.dto.request.LoginRequest;
import com.ecanopy.dto.request.RegisterRequest;
import com.ecanopy.dto.response.JwtAuthenticationResponse;
import com.ecanopy.dto.response.UserResponse;
import com.ecanopy.entity.Role;
import com.ecanopy.entity.User;
import com.ecanopy.exception.BusinessException;
import com.ecanopy.exception.UnauthorizedException;
import com.ecanopy.repository.RoleRepository;
import com.ecanopy.repository.UserRepository;
import com.ecanopy.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

        private final UserRepository userRepository;
        private final RoleRepository roleRepository;
        private final com.ecanopy.repository.ResidentRepository residentRepository;
        private final com.ecanopy.repository.PasswordResetTokenRepository passwordResetTokenRepository;
        private final PasswordEncoder passwordEncoder;
        private final AuthenticationManager authenticationManager;
        private final JwtTokenProvider jwtTokenProvider;

        @Value("${jwt.expiration}")
        private long jwtExpiration;

        @Transactional
        public JwtAuthenticationResponse register(RegisterRequest request) {
                // Check if email already exists
                if (userRepository.existsByEmail(request.getEmail())) {
                        throw new BusinessException("User with this email already exists");
                }

                // Create new user
                User user = User.builder()
                                .email(request.getEmail())
                                .fullName(request.getFullName())
                                .phoneNumber(request.getPhoneNumber())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .enabled(true)
                                .roles(new HashSet<>())
                                .build();

                // Assign default RESIDENT role
                Role residentRole = roleRepository.findByName("ROLE_RESIDENT")
                                .orElseThrow(() -> new BusinessException("Default role not found"));
                user.getRoles().add(residentRole);

                User savedUser = userRepository.save(user);

                // Auto-login after registration
                Authentication authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

                String token = jwtTokenProvider.generateToken(authentication);

                return JwtAuthenticationResponse.builder()
                                .accessToken(token)
                                .expiresIn(jwtExpiration)
                                .user(mapToUserResponse(savedUser))
                                .build();
        }

        public JwtAuthenticationResponse login(LoginRequest request) {
                try {
                        System.out.println("Attempting login for: " + request.getEmail());
                        Authentication authentication = authenticationManager.authenticate(
                                        new UsernamePasswordAuthenticationToken(request.getEmail(),
                                                        request.getPassword()));

                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        String token = jwtTokenProvider.generateToken(authentication);

                        User user = userRepository.findByEmail(request.getEmail())
                                        .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

                        return JwtAuthenticationResponse.builder()
                                        .accessToken(token)
                                        .expiresIn(jwtExpiration)
                                        .user(mapToUserResponse(user))
                                        .build();
                } catch (Exception e) {
                        System.err.println("Login failed for " + request.getEmail() + ": " + e.getMessage());
                        e.printStackTrace();
                        throw new UnauthorizedException("Invalid email or password");
                }
        }

        public UserResponse getCurrentUser() {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                String email = authentication.getName();

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new UnauthorizedException("User not found"));

                return mapToUserResponse(user);
        }

        @Transactional
        public void forgotPassword(String email) {
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new BusinessException("User with email " + email + " not found"));

                // Generate Token
                String token = java.util.UUID.randomUUID().toString();

                // Remove existing tokens
                passwordResetTokenRepository.deleteByUser(user);

                com.ecanopy.entity.PasswordResetToken resetToken = new com.ecanopy.entity.PasswordResetToken();
                resetToken.setToken(token);
                resetToken.setUser(user);
                resetToken.setExpiryDate(java.time.LocalDateTime.now().plusHours(1)); // 1 hour expiry

                passwordResetTokenRepository.save(resetToken);

                // Simulate Email Sending
                System.out.println("==================================================");
                System.out.println("PASSWORD RESET LINK FOR: " + email);
                System.out.println("http://localhost:5173/reset-password?token=" + token);
                System.out.println("==================================================");
        }

        @Transactional
        public void resetPassword(String token, String newPassword) {
                com.ecanopy.entity.PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                                .orElseThrow(() -> new BusinessException("Invalid or expired password reset token"));

                if (resetToken.isExpired()) {
                        throw new BusinessException("Token has expired");
                }

                User user = resetToken.getUser();
                user.setPassword(passwordEncoder.encode(newPassword));
                userRepository.save(user);

                passwordResetTokenRepository.delete(resetToken); // Cleanup
        }

        private UserResponse mapToUserResponse(User user) {
                Set<String> roles = user.getRoles().stream()
                                .map(Role::getName)
                                .collect(Collectors.toSet());

                String buildingName = null;
                String flatNumber = null;
                Long flatId = null;


                java.util.Optional<com.ecanopy.entity.Resident> residentOpt = residentRepository
                                .findByUserId(user.getId());

                if (residentOpt.isPresent()) {
                        com.ecanopy.entity.Resident resident = residentOpt.get();
                        if (resident.getFlat() != null) {
                                flatNumber = resident.getFlat().getFlatNumber();
                                flatId = resident.getFlat().getFlatId();
                                if (resident.getFlat().getBuilding() != null) {
                                        buildingName = resident.getFlat().getBuilding().getBuildingName();
                                }
                        }
                }

                return UserResponse.builder()
                                .id(user.getId())
                                .email(user.getEmail())
                                .fullName(user.getFullName())
                                .phoneNumber(user.getPhoneNumber())
                                .societyId(user.getSocietyId())
                                .buildingName(buildingName)
                                .flatNumber(flatNumber)
                                .flatId(flatId)
                                .roles(roles)
                                .build();
        }
}
