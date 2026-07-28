package com.nieldave.fittrackpro.service;

import com.nieldave.fittrackpro.dto.common.PageResponse;
import com.nieldave.fittrackpro.dto.exercise.ExerciseRequest;
import com.nieldave.fittrackpro.dto.exercise.ExerciseResponse;
import com.nieldave.fittrackpro.entity.Exercise;
import com.nieldave.fittrackpro.enums.Difficulty;
import com.nieldave.fittrackpro.enums.ExerciseCategory;
import com.nieldave.fittrackpro.enums.MuscleGroup;
import com.nieldave.fittrackpro.exception.ResourceNotFoundException;
import com.nieldave.fittrackpro.mapper.ExerciseMapper;
import com.nieldave.fittrackpro.repository.ExerciseRepository;
import com.nieldave.fittrackpro.repository.spec.ExerciseSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Exercise catalog is a shared, admin-curated resource (like Workout is not) -
 * it has no "owner" the way a User or Workout does, so there is no per-row
 * ownership check to make here. The access control that matters for this
 * resource is role-based (any authenticated user can READ, only ADMIN can
 * WRITE) and is enforced with @PreAuthorize at the controller layer.
 */
@Service
@RequiredArgsConstructor
public class ExerciseService {

    private final ExerciseRepository exerciseRepository;
    private final ExerciseMapper exerciseMapper;

    @Transactional
    public ExerciseResponse create(ExerciseRequest request) {
        Exercise exercise = exerciseMapper.toEntity(request);
        return exerciseMapper.toResponse(exerciseRepository.save(exercise));
    }

    public ExerciseResponse getById(Long id) {
        return exerciseMapper.toResponse(findOrThrow(id));
    }

    public PageResponse<ExerciseResponse> search(ExerciseCategory category,
                                                  MuscleGroup muscleGroup,
                                                  Difficulty difficulty,
                                                  String keyword,
                                                  Pageable pageable) {
        Page<ExerciseResponse> page = exerciseRepository
                .findAll(ExerciseSpecification.withFilters(category, muscleGroup, difficulty, keyword), pageable)
                .map(exerciseMapper::toResponse);
        return PageResponse.from(page);
    }

    @Transactional
    public ExerciseResponse update(Long id, ExerciseRequest request) {
        Exercise exercise = findOrThrow(id);
        // updateEntityFromRequest only copies the whitelisted fields defined
        // on ExerciseRequest - the entity's id/createdAt are never touched,
        // so a client cannot use this endpoint to rewrite either.
        exerciseMapper.updateEntityFromRequest(request, exercise);
        return exerciseMapper.toResponse(exerciseRepository.save(exercise));
    }

    @Transactional
    public void delete(Long id) {
        Exercise exercise = findOrThrow(id);
        exerciseRepository.delete(exercise);
    }

    private Exercise findOrThrow(Long id) {
        return exerciseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exercise not found with id: " + id));
    }
}
