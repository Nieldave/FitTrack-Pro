package com.nieldave.fittrackpro.dto.exercise;

import com.nieldave.fittrackpro.enums.Difficulty;
import com.nieldave.fittrackpro.enums.ExerciseCategory;
import com.nieldave.fittrackpro.enums.MuscleGroup;
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
public class ExerciseResponse {

    private Long id;
    private String name;
    private String description;
    private ExerciseCategory category;
    private MuscleGroup muscleGroup;
    private String equipment;
    private Difficulty difficulty;
    private Integer caloriesBurned;
    private String instructions;
}
