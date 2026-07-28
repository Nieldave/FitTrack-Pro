package com.nieldave.fittrackpro.controller;

import com.nieldave.fittrackpro.dto.common.PageResponse;
import com.nieldave.fittrackpro.dto.user.ChangePasswordRequest;
import com.nieldave.fittrackpro.dto.user.UpdateProfileRequest;
import com.nieldave.fittrackpro.dto.user.UserResponse;
import com.nieldave.fittrackpro.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "Profile self-service plus admin user management")
public class UserController {

    private final UserService userService;

    // ===================================================================
    // SELF-SERVICE - deliberately has NO {id} path variable.
    // "me" always resolves to whoever the JWT belongs to, so there is
    // nothing here for a user to tamper with to reach someone else's data.
    // This is the strongest possible fix for IDOR: don't accept an id at all.
    // ===================================================================

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMyProfile() {
        return ResponseEntity.ok(userService.getMyProfile());
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateMyProfile(@Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateMyProfile(request));
    }

    @PutMapping("/me/password")
    public ResponseEntity<Void> changeMyPassword(@Valid @RequestBody ChangePasswordRequest request) {
        userService.changeMyPassword(request);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteMyAccount() {
        userService.deleteMyAccount();
        return ResponseEntity.noContent().build();
    }

    // ===================================================================
    // ADMIN ONLY - these DO take an {id}, so they need real authorization.
    // @PreAuthorize runs BEFORE the method body, at the controller boundary -
    // this is the privilege-escalation fix: a plain USER JWT is rejected
    // with 403 here before any repository call ever happens.
    // UserService.requireAdmin() re-checks this again (defense in depth),
    // so even a future controller that forgets the annotation is still safe.
    // ===================================================================

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PageResponse<UserResponse>> getAllUsers(Pageable pageable) {
        return ResponseEntity.ok(userService.getAllUsers(pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/{id}/disable")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> disableUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.setUserEnabled(id, false));
    }

    @PutMapping("/{id}/enable")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> enableUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.setUserEnabled(id, true));
    }
}
