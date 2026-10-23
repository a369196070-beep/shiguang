package com.shiguang.web;

import com.shiguang.dto.MenuDto;
import com.shiguang.service.AuthService;
import com.shiguang.service.MenuService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/menu")
public class MenuController {
    private final MenuService menuService;
    private final AuthService authService;

    public MenuController(MenuService menuService, AuthService authService) {
        this.menuService = menuService;
        this.authService = authService;
    }

    @GetMapping("/today")
    public MenuDto today() {
        var principal = authService.currentPrincipal();
        return menuService.getMenu(principal == null ? null : principal.id(), false);
    }

    @PostMapping("/shuffle")
    public MenuDto shuffle() {
        var principal = authService.currentPrincipal();
        return menuService.getMenu(principal == null ? null : principal.id(), true);
    }
}
