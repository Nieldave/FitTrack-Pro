package com.nieldave.fittrackpro.service;

import com.nieldave.fittrackpro.dto.common.PageResponse;
import com.nieldave.fittrackpro.dto.user.ChangePasswordRequest;
import com.nieldave.fittrackpro.dto.user.UpdateProfileRequest;
import com.nieldave.fittrackpro.dto.user.UserResponse;
import com.nieldave.fittrackpro.entity.User;
import com.nieldave.fittrackpro.exception.InvalidCredentialsException;
import com.nieldave.fittrackpro.exception.ResourceNotFoundException;
import com.nieldave.fittrackpro.mapper.UserMapper;
import com.nieldave.fittrackpro.repository.UserRepository;
import com.nieldave.fittrackpro.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    // ---------- Self-service endpoints (no id in the URL - IDOR-proof by design) ----------

    public UserResponse getMyProfile() {
        User user = getCurrentUserOrThrow();
        return userMapper.toResponse(user);
    }

    @Transactional
    public UserResponse updateMyProfile(UpdateProfileRequest request) {
        User user = getCurrentUserOrThrow();
        user.setName(request.getName().trim());
        return userMapper.toResponse(userRepository.save(user));
    }

    @Transactional
    public void changeMyPassword(ChangePasswordRequest request) {
        User user = getCurrentUserOrThrow();

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional
    public void deleteMyAccount() {
        User user = getCurrentUserOrThrow();
        userRepository.delete(user);
    }

    // ---------- Admin-only endpoints (id IS in the URL - needs explicit checks) ----------
    // These are additionally locked down with @PreAuthorize("hasRole('ADMIN')")
    // at the controller. We re-check the role here too (defense in depth) so this
    // service can never be called unsafely by a future controller that forgets the annotation.

    public PageResponse<UserResponse> getAllUsers(Pageable pageable) {
        requireAdmin();
        Page<UserResponse> page = userRepository.findAll(pageable).map(userMapper::toResponse);
        return PageResponse.from(page);
    }

    public UserResponse getUserById(Long id) {
        requireAdmin();
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return userMapper.toResponse(user);
    }

    @Transactional
    public UserResponse setUserEnabled(Long id, boolean enabled) {
        requireAdmin();
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        user.setEnabled(enabled);
        return userMapper.toResponse(userRepository.save(user));
    }

    // ---------- helpers ----------

    private User getCurrentUserOrThrow() {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        return userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + currentUserId));
    }

    private void requireAdmin() {
        if (!SecurityUtils.isAdmin()) {
            throw new org.springframework.security.access.AccessDeniedException("Admin role required");
        }
    }
}
