package com.shiguang.web;

import com.shiguang.dto.FavoriteResult;
import com.shiguang.dto.RecipeDto;
import com.shiguang.dto.RecipeRequest;
import com.shiguang.service.AuthService;
import com.shiguang.service.RecipeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class RecipeController {
    private final RecipeService recipeService;
    private final AuthService authService;

    public RecipeController(RecipeService recipeService, AuthService authService) {
        this.recipeService = recipeService;
        this.authService = authService;
    }

    @GetMapping("/recipes")
    public List<RecipeDto> list() {
        return recipeService.list();
    }

    @GetMapping("/recipes/{id}")
    public RecipeDto detail(@PathVariable Long id) {
        return recipeService.get(id);
    }

    @PostMapping("/recipes")
    @ResponseStatus(HttpStatus.CREATED)
    public RecipeDto create(@Valid @RequestBody RecipeRequest request) {
        var principal = authService.requirePrincipal();
        return recipeService.create(principal.id(), request);
    }

    @DeleteMapping("/recipes/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        var principal = authService.requirePrincipal();
        recipeService.delete(id, principal.id());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me/recipes")
    public List<RecipeDto> mine() {
        return recipeService.listByAuthor(authService.requirePrincipal().id());
    }

    @GetMapping("/me/favorites")
    public List<RecipeDto> favorites() {
        return recipeService.favoriteRecipes(authService.requirePrincipal().id());
    }

    @PostMapping("/recipes/{id}/favorite")
    public FavoriteResult favorite(@PathVariable Long id) {
        return recipeService.favorite(id, authService.requirePrincipal().id());
    }

    @DeleteMapping("/recipes/{id}/favorite")
    public FavoriteResult unfavorite(@PathVariable Long id) {
        return recipeService.unfavorite(id, authService.requirePrincipal().id());
    }
}
