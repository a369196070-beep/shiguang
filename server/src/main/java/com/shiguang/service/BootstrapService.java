package com.shiguang.service;

import com.shiguang.dto.BootstrapDto;
import com.shiguang.dto.MenuDto;
import com.shiguang.dto.UserDto;
import com.shiguang.mapper.UserMapper;
import com.shiguang.meta.MetaCatalog;
import com.shiguang.security.UserPrincipal;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BootstrapService {
    private final UserMapper userMapper;
    private final RecipeService recipeService;
    private final MenuService menuService;
    private final AuthService authService;

    public BootstrapService(UserMapper userMapper,
                            RecipeService recipeService,
                            MenuService menuService,
                            AuthService authService) {
        this.userMapper = userMapper;
        this.recipeService = recipeService;
        this.menuService = menuService;
        this.authService = authService;
    }

    public BootstrapDto load(UserPrincipal principal) {
        UserDto currentUser = null;
        List<Long> favorites = List.of();
        if (principal != null) {
            var user = userMapper.selectById(principal.id());
            if (user != null) {
                currentUser = authService.toDto(user);
                favorites = recipeService.favoriteIds(principal.id());
            }
        }

        List<UserDto> users = userMapper.selectList(null).stream()
                .map(authService::toDto)
                .toList();
        MenuDto menu = menuService.getMenu(currentUser == null ? null : currentUser.id(), false);

        return new BootstrapDto(
                currentUser,
                users,
                recipeService.list(),
                favorites,
                MetaCatalog.CATEGORIES,
                MetaCatalog.TAGS,
                MetaCatalog.DIFFICULTIES,
                MetaCatalog.DEMO_ACCOUNT,
                menu
        );
    }
}
