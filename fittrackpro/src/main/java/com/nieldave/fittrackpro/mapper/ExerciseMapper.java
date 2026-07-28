package com.nieldave.fittrackpro.mapper;

import com.nieldave.fittrackpro.dto.exercise.ExerciseRequest;
import com.nieldave.fittrackpro.dto.exercise.ExerciseResponse;
import com.nieldave.fittrackpro.entity.Exercise;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ExerciseMapper {

    Exercise toEntity(ExerciseRequest request);

    ExerciseResponse toResponse(Exercise exercise);

    void updateEntityFromRequest(ExerciseRequest request, @MappingTarget Exercise exercise);
}
