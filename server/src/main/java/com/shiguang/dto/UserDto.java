package com.shiguang.dto;

import java.time.LocalDateTime;

public record UserDto(
        Long id,
        String name,
        String email,
        String bio,
        String avatarColor,
        String avatarUrl,
        boolean verified,
        LocalDateTime joinedAt
) {
}
