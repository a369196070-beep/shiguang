package com.shiguang.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record IngredientRequest(
        @NotBlank(message = "食材名不能为空。")
        @Size(max = 60, message = "食材名太长了。")
        String name,

        @NotBlank(message = "食材用量不能为空。")
        @Size(max = 60, message = "食材用量太长了。")
        String amount
) {
}
