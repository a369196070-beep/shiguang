package com.shiguang.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.List;

public record RecipeRequest(
        @NotBlank(message = "先给这道菜起个名字吧。")
        @Size(min = 2, max = 30, message = "菜名需要 2-30 个字。")
        String title,

        @NotBlank(message = "请选择分类。")
        String category,

        @NotBlank(message = "写一句让人想动筷子的介绍吧。")
        @Size(min = 4, max = 160, message = "介绍需要 4-160 个字。")
        String description,

        @Min(value = 1, message = "烹饪时间至少 1 分钟。")
        @Max(value = 1440, message = "烹饪时间不能超过 1440 分钟。")
        int time,

        @Min(value = 1, message = "份量至少 1 人。")
        @Max(value = 30, message = "份量不能超过 30 人。")
        int servings,

        @NotBlank(message = "请选择难度。")
        String difficulty,

        @Size(max = 200, message = "小贴士最多 200 字。")
        String tip,

        @Pattern(regexp = "^$|^/uploads/[A-Za-z0-9._-]+$", message = "封面图地址不合法。")
        String image,

        @Size(max = 3, message = "标签最多选 3 个。")
        List<String> tags,

        @NotEmpty(message = "至少写一个食材。")
        @Size(max = 30, message = "食材最多 30 项。")
        List<@Valid IngredientRequest> ingredients,

        @NotEmpty(message = "至少写一个步骤。")
        @Size(max = 30, message = "步骤最多 30 条。")
        List<@NotBlank(message = "步骤不能为空。") @Size(max = 300, message = "单条步骤最多 300 字。") String> steps
) {
}
