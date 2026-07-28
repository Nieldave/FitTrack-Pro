package com.nieldave.fittrackpro.entity;

import com.nieldave.fittrackpro.enums.Difficulty;
import com.nieldave.fittrackpro.enums.ExerciseCategory;
import com.nieldave.fittrackpro.enums.MuscleGroup;
import jakarta.persistence.*;
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
@Entity
@Table(name = "exercises")
public class Exercise extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ExerciseCategory category;

    @Enumerated(EnumType.STRING)
    @Column(name = "muscle_group", nullable = false, length = 30)
    private MuscleGroup muscleGroup;

    @Column(length = 150)
    private String equipment;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Difficulty difficulty;

    @Column(name = "calories_burned")
    private Integer caloriesBurned;

    @Column(length = 2000)
    private String instructions;
}
