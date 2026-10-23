package com.shiguang.dto;

import java.util.List;

public record BootstrapDto(
        UserDto user,
        List<UserDto> users,
        List<RecipeDto> recipes,
        List<Long> favorites,
        List<CategoryDto> categories,
        List<String> tags,
        List<String> difficulties,
        DemoAccountDto demoAccount,
        MenuDto menu
) {
}
