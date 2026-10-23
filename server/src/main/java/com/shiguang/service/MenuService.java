package com.shiguang.service;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shiguang.domain.DailyMenu;
import com.shiguang.domain.Recipe;
import com.shiguang.dto.MenuDto;
import com.shiguang.dto.MenuItemDto;
import com.shiguang.dto.RecipeDto;
import com.shiguang.mapper.DailyMenuMapper;
import com.shiguang.mapper.RecipeMapper;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class MenuService {
    private static final ZoneId ZONE = ZoneId.of("Asia/Shanghai");
    private static final List<String> MAIN_CATEGORIES = List.of("家常菜", "快手菜");
    private static final List<String> VEG_CATEGORIES = List.of("素菜");
    private static final List<String> SOUP_CATEGORIES = List.of("汤羹", "甜品", "主食");

    private final DailyMenuMapper dailyMenuMapper;
    private final RecipeMapper recipeMapper;
    private final RecipeService recipeService;
    private final ObjectMapper objectMapper;

    public MenuService(DailyMenuMapper dailyMenuMapper,
                       RecipeMapper recipeMapper,
                       RecipeService recipeService,
                       ObjectMapper objectMapper) {
        this.dailyMenuMapper = dailyMenuMapper;
        this.recipeMapper = recipeMapper;
        this.recipeService = recipeService;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public MenuDto getMenu(Long userId, boolean shuffle) {
        String ownerKey = ownerKey(userId);
        LocalDate today = LocalDate.now(ZONE);
        DailyMenu saved = find(ownerKey, today);

        if (!shuffle && saved != null) {
            List<Long> ids = parseIds(saved.getRecipeIds());
            List<RecipeDto> recipes = recipeService.byIds(ids);
            if (recipes.size() == 3) {
                return toMenu(recipes);
            }
        }

        List<Long> previous = saved == null ? List.of() : parseIds(saved.getRecipeIds());
        List<Long> selected = generate(previous);
        save(saved, ownerKey, today, selected);
        return toMenu(recipeService.byIds(selected));
    }

    private DailyMenu find(String ownerKey, LocalDate date) {
        return dailyMenuMapper.selectOne(Wrappers.<DailyMenu>lambdaQuery()
                .eq(DailyMenu::getOwnerKey, ownerKey)
                .eq(DailyMenu::getMenuDate, date));
    }

    private void save(DailyMenu saved, String ownerKey, LocalDate date, List<Long> ids) {
        String json;
        try {
            json = objectMapper.writeValueAsString(ids);
        } catch (Exception ex) {
            throw new IllegalStateException("无法保存今日菜单", ex);
        }
        if (saved == null) {
            DailyMenu menu = new DailyMenu();
            menu.setOwnerKey(ownerKey);
            menu.setMenuDate(date);
            menu.setRecipeIds(json);
            menu.setCreatedAt(LocalDateTime.now());
            try {
                dailyMenuMapper.insert(menu);
                return;
            } catch (DuplicateKeyException ignored) {
                saved = find(ownerKey, date);
            }
        }
        if (saved != null) {
            saved.setRecipeIds(json);
            saved.setCreatedAt(LocalDateTime.now());
            dailyMenuMapper.updateById(saved);
        }
    }

    private List<Long> generate(List<Long> previous) {
        List<Recipe> all = recipeMapper.selectList(Wrappers.<Recipe>lambdaQuery().orderByAsc(Recipe::getId));
        List<Recipe> mains = byCategories(all, MAIN_CATEGORIES);
        List<Recipe> vegetables = byCategories(all, VEG_CATEGORIES);
        List<Recipe> soups = byCategories(all, SOUP_CATEGORIES);
        if (mains.isEmpty()) mains = all;
        if (vegetables.isEmpty()) vegetables = all;
        if (soups.isEmpty()) soups = all;
        if (all.isEmpty()) {
            return List.of();
        }

        String previousSignature = signature(previous);
        List<Long> selected = null;
        for (int attempt = 0; attempt < 40; attempt++) {
            List<Long> candidate = List.of(
                    pick(mains).getId(),
                    pick(vegetables).getId(),
                    pick(soups).getId()
            );
            if (candidate.size() == 3 && !signature(candidate).equals(previousSignature)) {
                selected = candidate;
                break;
            }
            selected = candidate;
        }
        return selected == null ? List.of() : selected;
    }

    private Recipe pick(List<Recipe> source) {
        return source.get(ThreadLocalRandom.current().nextInt(source.size()));
    }

    private List<Recipe> byCategories(List<Recipe> recipes, List<String> categories) {
        Set<String> allowed = new LinkedHashSet<>(categories);
        return recipes.stream().filter(recipe -> allowed.contains(recipe.getCategory())).toList();
    }

    private String signature(List<Long> ids) {
        return ids.stream().map(String::valueOf).sorted().reduce((a, b) -> a + "|" + b).orElse("");
    }

    private List<Long> parseIds(String raw) {
        if (raw == null || raw.isBlank()) {
            return List.of();
        }
        try {
            List<Long> parsed = objectMapper.readValue(raw, new TypeReference<>() {
            });
            return parsed.stream().filter(id -> id != null && id > 0).limit(3).toList();
        } catch (Exception ignored) {
            // 兼容旧数据：id|id|id 或 id,id,id
            List<Long> parsed = new ArrayList<>();
            for (String piece : raw.split("[|,]")) {
                try {
                    parsed.add(Long.parseLong(piece.trim()));
                } catch (NumberFormatException ignoredPiece) {
                    // 跳过损坏字段
                }
            }
            return parsed.stream().limit(3).toList();
        }
    }

    private MenuDto toMenu(List<RecipeDto> recipes) {
        if (recipes.size() != 3) {
            return new MenuDto(List.of(), 0);
        }
        List<MenuItemDto> items = List.of(
                new MenuItemDto("主菜", recipes.get(0)),
                new MenuItemDto("素菜", recipes.get(1)),
                new MenuItemDto("汤 · 甜", recipes.get(2))
        );
        int total = recipes.stream().mapToInt(RecipeDto::time).sum();
        return new MenuDto(items, total);
    }

    private String ownerKey(Long userId) {
        return userId == null ? "guest" : "u:" + userId;
    }
}
