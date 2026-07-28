package com.nieldave.fittrackpro.controller;

import com.nieldave.fittrackpro.dto.common.PageResponse;
import com.nieldave.fittrackpro.dto.exercise.ExerciseRequest;
import com.nieldave.fittrackpro.dto.exercise.ExerciseResponse;
import com.nieldave.fittrackpro.enums.Difficulty;
import com.nieldave.fittrackpro.enums.ExerciseCategory;
import com.nieldave.fittrackpro.enums.MuscleGroup;
import com.nieldave.fittrackpro.service.ExerciseService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/exercises")
@RequiredArgsConstructor
@Tag(name = "Exercises", description = "Exercise catalog - readable by any authenticated user, writable by admins only")
public class ExerciseController {

    private final ExerciseService exerciseService;

    // Any authenticated user can browse the catalog.
    @GetMapping
    public ResponseEntity<PageResponse<ExerciseResponse>> search(
            @RequestParam(required = false) ExerciseCategory category,
            @RequestParam(required = false) MuscleGroup muscleGroup,
            @RequestParam(required = false) Difficulty difficulty,
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 20, sort = "id") Pageable pageable) {
        return ResponseEntity.ok(exerciseService.search(category, muscleGroup, difficulty, keyword, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExerciseResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(exerciseService.getById(id));
    }

    // Only admins may curate the shared catalog.
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ExerciseResponse> create(@Valid @RequestBody ExerciseRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(exerciseService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ExerciseResponse> update(@PathVariable Long id, @Valid @RequestBody ExerciseRequest request) {
        return ResponseEntity.ok(exerciseService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        exerciseService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
