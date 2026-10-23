package com.shiguang.dto;

import java.util.List;

public record MenuDto(List<MenuItemDto> items, int totalMinutes) {
}
