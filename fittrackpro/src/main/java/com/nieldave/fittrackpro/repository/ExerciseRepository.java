package com.nieldave.fittrackpro.repository;

import com.nieldave.fittrackpro.entity.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 * JpaSpecificationExecutor lets the service build dynamic WHERE clauses
 * (category / muscleGroup / difficulty / keyword, any combination) without
 * us hand-writing a query method for every permutation.
 */
public interface ExerciseRepository extends JpaRepository<Exercise, Long>, JpaSpecificationExecutor<Exercise> {
}
