package com.shiguang.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("users")
public class User {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String name;
    private String email;
    private String passwordHash;
    private String bio;
    private String avatarColor;
    private String avatarUrl;
    private Boolean verified;
    private LocalDateTime createdAt;
}
