package com.nieldave.fittrackpro.service;

import com.nieldave.fittrackpro.dto.common.PageResponse;
import com.nieldave.fittrackpro.dto.workout.*;
import com.nieldave.fittrackpro.entity.*;
import com.nieldave.fittrackpro.exception.ResourceNotFoundException;
import com.nieldave.fittrackpro.repository.*;
import com.nieldave.fittrackpro.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Workout is the first USER-OWNED resource in the app (unlike Exercise,
 * which is a shared admin-curated catalog). Every method that touches a
 * specific workout by id calls checkOwnership() before reading or writing
 * anything - that is the IDOR/BOLA fix described in SECURITY.md, applied
 * for real here.
 */
@Service
@RequiredArgsConstructor
public class WorkoutService {

    private final WorkoutRepository workoutRepository;
    private final WorkoutHistoryRepository workoutHistoryRepository;
    private final ExerciseRepository exerciseRepository;
    private final UserRepository userRepository;

    @Transactional
    public WorkoutResponse createWorkout(WorkoutRequest request) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        User owner = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + currentUserId));

        Workout workout = Workout.builder()
                .user(owner)
                .title(request.getTitle().trim())
                .day(request.getDay())
                .duration(request.getDuration())
                .build();

        attachExercises(workout, request.getExercises());

        // Cascade = ALL on Workout.workoutExercises means saving the parent
        // persists every child WorkoutExercise row in the same transaction -
        // if anything below fails, the whole insert rolls back together.
        Workout saved = workoutRepository.save(workout);
        return toResponse(saved);
    }

    public WorkoutResponse getWorkoutById(Long id) {
        Workout workout = findOrThrow(id);
        checkOwnership(workout);
        return toResponse(workout);
    }

    public PageResponse<WorkoutResponse> listMyWorkouts(Pageable pageable) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        Page<WorkoutResponse> page = workoutRepository.findByUserId(currentUserId, pageable)
                .map(this::toResponse);
        return PageResponse.from(page);
    }

    @Transactional
    public WorkoutResponse updateWorkout(Long id, WorkoutRequest request) {
        Workout workout = findOrThrow(id);
        checkOwnership(workout);

        workout.setTitle(request.getTitle().trim());
        workout.setDay(request.getDay());
        workout.setDuration(request.getDuration());

        // orphanRemoval = true on Workout.workoutExercises means clearing
        // this list and re-populating it deletes the old rows and inserts
        // the new ones, all inside this one transaction.
        workout.getWorkoutExercises().clear();
        attachExercises(workout, request.getExercises());

        Workout saved = workoutRepository.save(workout);
        return toResponse(saved);
    }

    @Transactional
    public void deleteWorkout(Long id) {
        Workout workout = findOrThrow(id);
        checkOwnership(workout);
        workoutRepository.delete(workout);
    }

    @Transactional
    public WorkoutHistoryResponse logHistory(Long workoutId, WorkoutHistoryRequest request) {
        Workout workout = findOrThrow(workoutId);
        checkOwnership(workout);

        WorkoutHistory history = WorkoutHistory.builder()
                .workout(workout)
                .user(workout.getUser())
                .date(request.getDate())
                .duration(request.getDuration())
                .calories(request.getCalories())
                .completed(Boolean.TRUE.equals(request.getCompleted()))
                .build();

        WorkoutHistory saved = workoutHistoryRepository.save(history);
        return toHistoryResponse(saved);
    }

    public PageResponse<WorkoutHistoryResponse> getHistoryForWorkout(Long workoutId, Pageable pageable) {
        Workout workout = findOrThrow(workoutId);
        checkOwnership(workout);

        Long ownerId = workout.getUser().getId();
        Page<WorkoutHistoryResponse> page = workoutHistoryRepository
                .findByWorkoutIdAndUserId(workoutId, ownerId, pageable)
                .map(this::toHistoryResponse);
        return PageResponse.from(page);
    }

    public PageResponse<WorkoutHistoryResponse> listMyHistory(Pageable pageable) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        Page<WorkoutHistoryResponse> page = workoutHistoryRepository.findByUserId(currentUserId, pageable)
                .map(this::toHistoryResponse);
        return PageResponse.from(page);
    }

    // ---------- helpers ----------

    private void attachExercises(Workout workout, List<WorkoutExerciseRequest> requests) {
        List<WorkoutExercise> workoutExercises = new ArrayList<>();
        int fallbackOrder = 1;

        for (WorkoutExerciseRequest req : requests) {
            Exercise exercise = exerciseRepository.findById(req.getExerciseId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Exercise not found with id: " + req.getExerciseId()));

            workoutExercises.add(WorkoutExercise.builder()
                    .workout(workout)
                    .exercise(exercise)
                    .sets(req.getSets())
                    .reps(req.getReps())
                    .sequenceOrder(req.getSequenceOrder() != null ? req.getSequenceOrder() : fallbackOrder)
                    .build());
            fallbackOrder++;
        }

        workout.getWorkoutExercises().addAll(workoutExercises);
    }

    /**
     * The core IDOR/BOLA guard for this whole service. Every public method
     * above that accepts a workout id calls this before touching the row.
     */
    private void checkOwnership(Workout workout) {
        if (!SecurityUtils.isSelfOrAdmin(workout.getUser().getId())) {
            throw new AccessDeniedException("You do not have access to this workout");
        }
    }

    private Workout findOrThrow(Long id) {
        return workoutRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workout not found with id: " + id));
    }

    private WorkoutResponse toResponse(Workout workout) {
        List<WorkoutExerciseResponse> exerciseResponses = workout.getWorkoutExercises().stream()
                .sorted(Comparator.comparing(
                        we -> we.getSequenceOrder() == null ? Integer.MAX_VALUE : we.getSequenceOrder()))
                .map(we -> WorkoutExerciseResponse.builder()
                        .id(we.getId())
                        .exerciseId(we.getExercise().getId())
                        .exerciseName(we.getExercise().getName())
                        .sets(we.getSets())
                        .reps(we.getReps())
                        .sequenceOrder(we.getSequenceOrder())
                        .build())
                .collect(Collectors.toList());

        return WorkoutResponse.builder()
                .id(workout.getId())
                .userId(workout.getUser().getId())
                .title(workout.getTitle())
                .day(workout.getDay())
                .duration(workout.getDuration())
                .exercises(exerciseResponses)
                .build();
    }

    private WorkoutHistoryResponse toHistoryResponse(WorkoutHistory history) {
        return WorkoutHistoryResponse.builder()
                .id(history.getId())
                .workoutId(history.getWorkout().getId())
                .workoutTitle(history.getWorkout().getTitle())
                .date(history.getDate())
                .duration(history.getDuration())
                .calories(history.getCalories())
                .completed(history.isCompleted())
                .build();
    }
}
