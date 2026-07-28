package com.nieldave.fittrackpro.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * Every "is this MY resource" check in the app should go through here.
 * Centralizing it means we never accidentally trust a client-supplied
 * id when deciding what a user is allowed to touch.
 */
public final class SecurityUtils {

    private SecurityUtils() {
    }

    public static CustomUserDetails getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails userDetails)) {
            throw new IllegalStateException("No authenticated user found in security context");
        }
        return userDetails;
    }

    public static Long getCurrentUserId() {
        return getCurrentUser().getId();
    }

    public static boolean isAdmin() {
        return getCurrentUser().getUser().getRole().name().equals("ADMIN");
    }

    /**
     * The core IDOR/BOLA guard: is the currently authenticated principal
     * either the owner of the resource, or an admin? Every endpoint that
     * reads/writes a specific user's data (by id) must call this before
     * touching the row - never rely on the URL id alone.
     */
    public static boolean isSelfOrAdmin(Long resourceOwnerId) {
        return getCurrentUserId().equals(resourceOwnerId) || isAdmin();
    }
}
