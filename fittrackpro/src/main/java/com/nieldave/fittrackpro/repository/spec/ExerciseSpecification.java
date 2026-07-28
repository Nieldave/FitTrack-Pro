package com.nieldave.fittrackpro.repository.spec;

import com.nieldave.fittrackpro.entity.Exercise;
import com.nieldave.fittrackpro.enums.Difficulty;
import com.nieldave.fittrackpro.enums.ExerciseCategory;
import com.nieldave.fittrackpro.enums.MuscleGroup;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

/**
 * Every filter here goes through the JPA Criteria API, which always binds
 * values as query parameters under the hood - there is no string
 * concatenation anywhere in this class, so it is not possible to inject
 * SQL through category/muscleGroup/difficulty/keyword. Compare this to
 * something like:
 *   "SELECT * FROM exercises WHERE name LIKE '%" + keyword + "%'"
 * which WOULD be injectable. Spring Data / Criteria API never builds
 * queries that way.
 */
public final class ExerciseSpecification {

    private ExerciseSpecification() {
    }

    public static Specification<Exercise> withFilters(ExerciseCategory category,
                                                        MuscleGroup muscleGroup,
                                                        Difficulty difficulty,
                                                        String keyword) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (category != null) {
                predicates.add(cb.equal(root.get("category"), category));
            }
            if (muscleGroup != null) {
                predicates.add(cb.equal(root.get("muscleGroup"), muscleGroup));
            }
            if (difficulty != null) {
                predicates.add(cb.equal(root.get("difficulty"), difficulty));
            }
            if (keyword != null && !keyword.isBlank()) {
                String likePattern = "%" + keyword.trim().toLowerCase() + "%";
                predicates.add(cb.like(cb.lower(root.get("name")), likePattern));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
