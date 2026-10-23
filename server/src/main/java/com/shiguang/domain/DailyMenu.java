package com.shiguang.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("daily_menus")
public class DailyMenu {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String ownerKey;
    private LocalDate menuDate;
    private String recipeIds;
    private LocalDateTime createdAt;
}
