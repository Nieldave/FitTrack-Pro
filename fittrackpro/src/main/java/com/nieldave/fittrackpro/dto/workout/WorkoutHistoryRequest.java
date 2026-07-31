package com.nieldave.fittrackpro.dto.workout;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
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
public class WorkoutHistoryRequest {

    @NotNull(message = "Date is required")
    private LocalDate date;

    @PositiveOrZero(message = "Duration cannot be negative")
    private Integer duration;

    @PositiveOrZero(message = "Calories cannot be negative")
    private Integer calories;

    @NotNull(message = "Completed flag is required")
    private Boolean completed;
}
