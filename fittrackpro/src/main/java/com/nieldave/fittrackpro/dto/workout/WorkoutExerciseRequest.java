package com.nieldave.fittrackpro.dto.workout;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutExerciseRequest {

    @NotNull(message = "Exercise id is required")
    private Long exerciseId;

    @NotNull(message = "Sets is required")
    @Positive(message = "Sets must be positive")
    private Integer sets;

    @NotNull(message = "Reps is required")
    @Positive(message = "Reps must be positive")
    private Integer reps;

    @Positive(message = "Sequence order must be positive")
    private Integer sequenceOrder;
}
