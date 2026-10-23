package com.shiguang.dto;

import java.time.LocalDateTime;
import java.util.List;

public record RecipeDto(
        Long id,
        String title,
        String emoji,
        String category,
        String description,
        Long authorId,
        int time,
        String difficulty,
        int servings,
        List<String> tags,
        List<IngredientDto> ingredients,
        List<String> steps,
        String tip,
        String image,
        int crowd,
        String source,
        LocalDateTime createdAt
) {
}
