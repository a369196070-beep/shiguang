package com.shiguang.dto;

public record MeResponse(boolean authenticated, UserDto user) {
    public static MeResponse guest() {
        return new MeResponse(false, null);
    }

    public static MeResponse of(UserDto user) {
        return new MeResponse(true, user);
    }
}
