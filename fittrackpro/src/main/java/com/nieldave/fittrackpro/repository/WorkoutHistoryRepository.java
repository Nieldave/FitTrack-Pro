package com.nieldave.fittrackpro.repository;

import com.nieldave.fittrackpro.entity.WorkoutHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkoutHistoryRepository extends JpaRepository<WorkoutHistory, Long> {

    Page<WorkoutHistory> findByWorkoutIdAndUserId(Long workoutId, Long userId, Pageable pageable);

    Page<WorkoutHistory> findByUserId(Long userId, Pageable pageable);
}
