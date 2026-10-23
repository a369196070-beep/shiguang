package com.shiguang.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("ingredients")
public class Ingredient {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long recipeId;
    private String name;
    private String amount;
    private Integer sortNo;
}
