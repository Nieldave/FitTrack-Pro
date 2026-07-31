package com.nieldave.fittrackpro.dto.workout;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 150, message = "Title must be at most 150 characters")
    private String title;

    @Size(max = 20, message = "Day must be at most 20 characters")
    private String day;

    @Positive(message = "Duration must be positive")
    private Integer duration;

    @NotEmpty(message = "A workout must contain at least one exercise")
    @Valid
    private List<WorkoutExerciseRequest> exercises;
}
