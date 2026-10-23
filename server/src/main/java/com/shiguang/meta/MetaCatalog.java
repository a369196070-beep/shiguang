package com.shiguang.meta;

import com.shiguang.common.ApiException;
import com.shiguang.dto.CategoryDto;
import com.shiguang.dto.DemoAccountDto;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

public final class MetaCatalog {
    public static final List<CategoryDto> CATEGORIES = List.of(
            new CategoryDto("家常菜", "🍳", List.of("#F4D6BE", "#D98C5F")),
            new CategoryDto("快手菜", "⚡", List.of("#F6E5BD", "#DDAE55")),
            new CategoryDto("素菜", "🥬", List.of("#DDE7CC", "#8CA36B")),
            new CategoryDto("汤羹", "🍲", List.of("#F2D9CC", "#C57E68")),
            new CategoryDto("主食", "🍚", List.of("#EDE0C8", "#BC9A6B")),
            new CategoryDto("甜品", "🍰", List.of("#F5DCE2", "#C98CA1"))
    );

    public static final List<String> TAGS = List.of(
            "下饭神器", "新手友好", "快手", "低脂", "高蛋白", "治愈系", "宴客菜",
            "一锅出", "一人食", "酸甜", "甜品", "烘焙", "下午茶", "素食", "慢炖"
    );

    public static final List<String> DIFFICULTIES = List.of("简单", "中等", "进阶");

    public static final DemoAccountDto DEMO_ACCOUNT = new DemoAccountDto("xiaoman@shiguang.app", "123456");

    private static final Map<String, CategoryDto> CATEGORY_MAP = CATEGORIES.stream()
            .collect(Collectors.toMap(CategoryDto::name, Function.identity()));

    private MetaCatalog() {
    }

    public static CategoryDto category(String name) {
        CategoryDto category = CATEGORY_MAP.get(name);
        if (category == null) {
            throw ApiException.badRequest("请选择有效的菜谱分类。");
        }
        return category;
    }

    public static String emojiOf(String category) {
        return category(category).emoji();
    }
}
