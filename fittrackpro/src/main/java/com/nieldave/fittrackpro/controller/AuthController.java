package com.nieldave.fittrackpro.controller;

import com.nieldave.fittrackpro.dto.auth.AuthResponse;
import com.nieldave.fittrackpro.dto.auth.LoginRequest;
import com.nieldave.fittrackpro.dto.auth.RefreshRequest;
import com.nieldave.fittrackpro.dto.auth.RegisterRequest;
import com.nieldave.fittrackpro.service.AuthService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Register, login, and refresh tokens - all public endpoints")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Register request received for email={}", request.getEmail());
        AuthResponse response = authService.register(request);
        log.info("Register succeeded — new userId={} email={}", response.getUserId(), response.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login request received for email={}", request.getEmail());
        AuthResponse response = authService.login(request);
        log.info("Login succeeded — userId={} email={}", response.getUserId(), response.getEmail());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshRequest request) {
        log.info("Token refresh requested");
        AuthResponse response = authService.refresh(request);
        log.info("Token refresh succeeded — userId={}", response.getUserId());
        return ResponseEntity.ok(response);
    }
}