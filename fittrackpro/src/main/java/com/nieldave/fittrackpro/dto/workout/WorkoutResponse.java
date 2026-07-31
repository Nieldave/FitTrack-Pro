package com.nieldave.fittrackpro.dto.workout;

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
public class WorkoutResponse {

    private Long id;
    private Long userId;
    private String title;
    private String day;
    private Integer duration;
    private List<WorkoutExerciseResponse> exercises;
}
