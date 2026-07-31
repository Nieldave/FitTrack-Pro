package com.nieldave.fittrackpro.dto.workout;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutHistoryResponse {

    private Long id;
    private Long workoutId;
    private String workoutTitle;
    private LocalDate date;
    private Integer duration;
    private Integer calories;
    private boolean completed;
}
