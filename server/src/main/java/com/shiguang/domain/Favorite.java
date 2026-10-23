package com.shiguang.domain;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("favorites")
public class Favorite {
    private Long userId;
    private Long recipeId;
    private LocalDateTime createdAt;
}
