package com.shiguang.domain;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("recipe_tags")
public class RecipeTag {
    private Long recipeId;
    private Long tagId;
}
