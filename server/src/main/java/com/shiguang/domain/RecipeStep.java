package com.shiguang.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("recipe_steps")
public class RecipeStep {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long recipeId;
    private String content;
    private Integer sortNo;
}
