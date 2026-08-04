package com.nieldave.fittrackpro.service;

import com.nieldave.fittrackpro.dto.auth.AuthResponse;
import com.nieldave.fittrackpro.dto.auth.LoginRequest;
import com.nieldave.fittrackpro.dto.auth.RefreshRequest;
import com.nieldave.fittrackpro.dto.auth.RegisterRequest;
import com.nieldave.fittrackpro.entity.User;
import com.nieldave.fittrackpro.enums.Role;
import com.nieldave.fittrackpro.exception.DuplicateResourceException;
import com.nieldave.fittrackpro.exception.InvalidCredentialsException;
import com.nieldave.fittrackpro.repository.UserRepository;
import com.nieldave.fittrackpro.security.CustomUserDetails;
import com.nieldave.fittrackpro.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Mass-assignment guard: we read only the fields RegisterRequest
        // declares (name/email/password). There is no way for a client to
        // sneak a "role":"ADMIN" or "id":5 field into the User entity -
        // we build the entity ourselves and hardcode role = USER.
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(normalizedEmail)) {
            log.warn("Register rejected - email already exists: {}", normalizedEmail);
            throw new DuplicateResourceException("An account with this email already exists");
        }

        User user = User.builder()
                .name(request.getName().trim())
                .email(normalizedEmail)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .enabled(true)
                .build();

        User saved = userRepository.save(user);
        log.info("Persisted new user id={} email={} to database", saved.getId(), saved.getEmail());

        CustomUserDetails userDetails = new CustomUserDetails(saved);
        return buildAuthResponse(userDetails, saved);
    }

    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(normalizedEmail, request.getPassword())
            );
        } catch (BadCredentialsException e) {
            log.warn("Login failed - bad credentials for email={}", normalizedEmail);
            throw new InvalidCredentialsException("Invalid email or password");
        }

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> {
                    log.warn("Login failed - no user row for email={}", normalizedEmail);
                    return new InvalidCredentialsException("Invalid email or password");
                });

        log.info("Login authenticated against database - userId={} email={}", user.getId(), user.getEmail());

        CustomUserDetails userDetails = new CustomUserDetails(user);
        return buildAuthResponse(userDetails, user);
    }

    public AuthResponse refresh(RefreshRequest request) {
        String token = request.getRefreshToken();
        String tokenType = jwtUtil.extractTokenType(token);

        if (!"refresh".equals(tokenType)) {
            log.warn("Refresh rejected - wrong token type: {}", tokenType);
            throw new InvalidCredentialsException("Invalid token type - a refresh token is required");
        }

        String email = jwtUtil.extractEmail(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.warn("Refresh failed - no user row for email={}", email);
                    return new InvalidCredentialsException("Invalid refresh token");
                });

        CustomUserDetails userDetails = new CustomUserDetails(user);

        if (!jwtUtil.isTokenValid(token, userDetails)) {
            log.warn("Refresh failed - token invalid or expired for userId={}", user.getId());
            throw new InvalidCredentialsException("Refresh token is invalid or expired");
        }

        log.info("Refresh succeeded for userId={}", user.getId());
        return buildAuthResponse(userDetails, user);
    }

    private AuthResponse buildAuthResponse(CustomUserDetails userDetails, User user) {
        // Never log request.getPassword(), the generated accessToken, or the
        // refreshToken - only non-sensitive identifiers (userId/email/role).
        log.debug("Generating JWT tokens for user={}", user.getEmail());

        String accessToken = jwtUtil.generateAccessToken(userDetails, user.getId(), user.getRole().name());
        String refreshToken = jwtUtil.generateRefreshToken(userDetails);

        log.info("JWT issued successfully for userId={}", user.getId());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}