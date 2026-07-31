package com.nieldave.fittrackpro.controller;

import com.nieldave.fittrackpro.dto.common.PageResponse;
import com.nieldave.fittrackpro.dto.workout.*;
import com.nieldave.fittrackpro.service.WorkoutService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/workouts")
@RequiredArgsConstructor
@Tag(name = "Workouts", description = "User-owned workout plans and completion history")
public class WorkoutController {

    private final WorkoutService workoutService;

    @PostMapping
    public ResponseEntity<WorkoutResponse> create(@Valid @RequestBody WorkoutRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(workoutService.createWorkout(request));
    }

    @GetMapping
    public ResponseEntity<PageResponse<WorkoutResponse>> listMine(
            @PageableDefault(size = 20, sort = "id") Pageable pageable) {
        return ResponseEntity.ok(workoutService.listMyWorkouts(pageable));
    }

    // Ownership is enforced inside WorkoutService.checkOwnership() - a USER
    // token that isn't the owner (and isn't an ADMIN) gets 403 here, no
    // matter which id they try. This is the id-in-URL case described in
    // SECURITY.md, where the fix is an explicit ownership check rather than
    // avoiding the id altogether (Workouts are inherently addressed by id).
    @GetMapping("/{id}")
    public ResponseEntity<WorkoutResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(workoutService.getWorkoutById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkoutResponse> update(@PathVariable Long id, @Valid @RequestBody WorkoutRequest request) {
        return ResponseEntity.ok(workoutService.updateWorkout(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        workoutService.deleteWorkout(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/history")
    public ResponseEntity<WorkoutHistoryResponse> logHistory(@PathVariable Long id,
                                                              @Valid @RequestBody WorkoutHistoryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(workoutService.logHistory(id, request));
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<PageResponse<WorkoutHistoryResponse>> getHistoryForWorkout(
            @PathVariable Long id, @PageableDefault(size = 20, sort = "date") Pageable pageable) {
        return ResponseEntity.ok(workoutService.getHistoryForWorkout(id, pageable));
    }

    @GetMapping("/history/me")
    public ResponseEntity<PageResponse<WorkoutHistoryResponse>> listMyHistory(
            @PageableDefault(size = 20, sort = "date") Pageable pageable) {
        return ResponseEntity.ok(workoutService.listMyHistory(pageable));
    }
}
