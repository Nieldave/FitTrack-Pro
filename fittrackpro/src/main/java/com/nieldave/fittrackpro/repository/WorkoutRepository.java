package com.nieldave.fittrackpro.repository;

import com.nieldave.fittrackpro.entity.Workout;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkoutRepository extends JpaRepository<Workout, Long> {

    // Always filtered by userId - this is the query-level half of the
    // ownership guarantee; the service-level SecurityUtils check is the other half.
    Page<Workout> findByUserId(Long userId, Pageable pageable);
}
