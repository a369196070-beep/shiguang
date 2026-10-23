package com.shiguang.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("recipes")
public class Recipe {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long authorId;
    private String title;
    private String emoji;
    private String category;
    private String description;
    private Integer cookTime;
    private String difficulty;
    private Integer servings;
    private String tip;
    private String coverUrl;
    private Integer crowd;
    private String source;
    private LocalDateTime createdAt;
}
