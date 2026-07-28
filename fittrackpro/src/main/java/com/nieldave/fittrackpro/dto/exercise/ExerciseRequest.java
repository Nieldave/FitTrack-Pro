package com.nieldave.fittrackpro.dto.exercise;

import com.nieldave.fittrackpro.enums.Difficulty;
import com.nieldave.fittrackpro.enums.ExerciseCategory;
import com.nieldave.fittrackpro.enums.MuscleGroup;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
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
public class ExerciseRequest {

    @NotBlank(message = "Exercise name is required")
    @Size(max = 150, message = "Name must be at most 150 characters")
    private String name;

    @Size(max = 1000, message = "Description must be at most 1000 characters")
    private String description;

    @NotNull(message = "Category is required")
    private ExerciseCategory category;

    @NotNull(message = "Muscle group is required")
    private MuscleGroup muscleGroup;

    @Size(max = 150, message = "Equipment must be at most 150 characters")
    private String equipment;

    @NotNull(message = "Difficulty is required")
    private Difficulty difficulty;

    @PositiveOrZero(message = "Calories burned cannot be negative")
    private Integer caloriesBurned;

    @Size(max = 2000, message = "Instructions must be at most 2000 characters")
    private String instructions;
}
