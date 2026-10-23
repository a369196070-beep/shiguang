package com.shiguang.service;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.shiguang.common.ApiException;
import com.shiguang.domain.Favorite;
import com.shiguang.domain.Ingredient;
import com.shiguang.domain.Recipe;
import com.shiguang.domain.RecipeStep;
import com.shiguang.domain.RecipeTag;
import com.shiguang.domain.Tag;
import com.shiguang.domain.User;
import com.shiguang.dto.FavoriteResult;
import com.shiguang.dto.IngredientDto;
import com.shiguang.dto.RecipeDto;
import com.shiguang.dto.RecipeRequest;
import com.shiguang.mapper.FavoriteMapper;
import com.shiguang.mapper.IngredientMapper;
import com.shiguang.mapper.RecipeMapper;
import com.shiguang.mapper.RecipeStepMapper;
import com.shiguang.mapper.RecipeTagMapper;
import com.shiguang.mapper.TagMapper;
import com.shiguang.mapper.UserMapper;
import com.shiguang.meta.MetaCatalog;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class RecipeService {
    private final RecipeMapper recipeMapper;
    private final IngredientMapper ingredientMapper;
    private final RecipeStepMapper stepMapper;
    private final TagMapper tagMapper;
    private final RecipeTagMapper recipeTagMapper;
    private final FavoriteMapper favoriteMapper;
    private final UserMapper userMapper;

    public RecipeService(RecipeMapper recipeMapper,
                         IngredientMapper ingredientMapper,
                         RecipeStepMapper stepMapper,
                         TagMapper tagMapper,
                         RecipeTagMapper recipeTagMapper,
                         FavoriteMapper favoriteMapper,
                         UserMapper userMapper) {
        this.recipeMapper = recipeMapper;
        this.ingredientMapper = ingredientMapper;
        this.stepMapper = stepMapper;
        this.tagMapper = tagMapper;
        this.recipeTagMapper = recipeTagMapper;
        this.favoriteMapper = favoriteMapper;
        this.userMapper = userMapper;
    }

    public List<RecipeDto> list() {
        return toDtos(recipeMapper.selectList(Wrappers.<Recipe>lambdaQuery()
                .orderByDesc(Recipe::getCreatedAt)
                .orderByDesc(Recipe::getId)));
    }

    public List<RecipeDto> listByAuthor(Long authorId) {
        return toDtos(recipeMapper.selectList(Wrappers.<Recipe>lambdaQuery()
                .eq(Recipe::getAuthorId, authorId)
                .orderByDesc(Recipe::getCreatedAt)
                .orderByDesc(Recipe::getId)));
    }

    public List<RecipeDto> favoriteRecipes(Long userId) {
        List<Favorite> favorites = favoriteMapper.selectList(Wrappers.<Favorite>lambdaQuery()
                .eq(Favorite::getUserId, userId)
                .orderByDesc(Favorite::getCreatedAt));
        if (favorites.isEmpty()) {
            return List.of();
        }
        Map<Long, Recipe> byId = recipeMapper.selectBatchIds(favorites.stream().map(Favorite::getRecipeId).toList())
                .stream().collect(Collectors.toMap(Recipe::getId, Function.identity()));
        List<Recipe> ordered = favorites.stream().map(f -> byId.get(f.getRecipeId())).filter(Objects::nonNull).toList();
        return toDtos(ordered);
    }

    public List<Long> favoriteIds(Long userId) {
        return favoriteMapper.selectList(Wrappers.<Favorite>lambdaQuery().eq(Favorite::getUserId, userId))
                .stream().map(Favorite::getRecipeId).toList();
    }

    public RecipeDto get(Long id) {
        return toDtos(List.of(requireRecipe(id))).get(0);
    }

    public RecipeDto getOptional(Long id) {
        Recipe recipe = recipeMapper.selectById(id);
        return recipe == null ? null : toDtos(List.of(recipe)).get(0);
    }

    public List<RecipeDto> byIds(List<Long> ids) {
        if (ids.isEmpty()) {
            return List.of();
        }
        Map<Long, Recipe> byId = recipeMapper.selectBatchIds(ids).stream()
                .collect(Collectors.toMap(Recipe::getId, Function.identity()));
        return toDtos(ids.stream().map(byId::get).filter(Objects::nonNull).toList());
    }

    @Transactional
    public RecipeDto create(Long userId, RecipeRequest request) {
        MetaCatalog.category(request.category());
        if (!MetaCatalog.DIFFICULTIES.contains(request.difficulty())) {
            throw ApiException.badRequest("请选择有效的难度。");
        }

        List<String> tags = normalizeTags(request.tags());
        String image = request.image() == null || request.image().isBlank() ? null : request.image().trim();

        Recipe recipe = new Recipe();
        recipe.setAuthorId(userId);
        recipe.setTitle(request.title().trim());
        recipe.setEmoji(MetaCatalog.emojiOf(request.category()));
        recipe.setCategory(request.category());
        recipe.setDescription(request.description().trim());
        recipe.setCookTime(request.time());
        recipe.setDifficulty(request.difficulty());
        recipe.setServings(request.servings());
        recipe.setTip(request.tip() == null ? "" : request.tip().trim());
        recipe.setCoverUrl(image);
        recipe.setCrowd(0);
        recipe.setSource("user");
        recipe.setCreatedAt(LocalDateTime.now());
        recipeMapper.insert(recipe);

        for (int i = 0; i < request.ingredients().size(); i++) {
            var item = request.ingredients().get(i);
            Ingredient ingredient = new Ingredient();
            ingredient.setRecipeId(recipe.getId());
            ingredient.setName(item.name().trim());
            ingredient.setAmount(item.amount().trim());
            ingredient.setSortNo(i);
            ingredientMapper.insert(ingredient);
        }

        for (int i = 0; i < request.steps().size(); i++) {
            RecipeStep step = new RecipeStep();
            step.setRecipeId(recipe.getId());
            step.setContent(request.steps().get(i).trim());
            step.setSortNo(i);
            stepMapper.insert(step);
        }

        for (String tagName : tags) {
            Tag tag = tagMapper.selectOne(Wrappers.<Tag>lambdaQuery().eq(Tag::getName, tagName));
            if (tag == null) {
                tag = new Tag();
                tag.setName(tagName);
                tagMapper.insert(tag);
            }
            RecipeTag link = new RecipeTag();
            link.setRecipeId(recipe.getId());
            link.setTagId(tag.getId());
            recipeTagMapper.insert(link);
        }

        return get(recipe.getId());
    }

    @Transactional
    public void delete(Long id, Long userId) {
        Recipe recipe = requireRecipe(id);
        if (!recipe.getAuthorId().equals(userId)) {
            throw ApiException.forbidden("只能删除自己上传的菜谱。");
        }
        recipeMapper.deleteById(id);
    }

    @Transactional
    public FavoriteResult favorite(Long recipeId, Long userId) {
        Recipe recipe = requireRecipe(recipeId);
        Favorite existing = favoriteMapper.selectOne(Wrappers.<Favorite>lambdaQuery()
                .eq(Favorite::getUserId, userId)
                .eq(Favorite::getRecipeId, recipeId));
        if (existing != null) {
            return new FavoriteResult(true, recipe.getCrowd());
        }
        Favorite favorite = new Favorite();
        favorite.setUserId(userId);
        favorite.setRecipeId(recipeId);
        favorite.setCreatedAt(LocalDateTime.now());
        try {
            favoriteMapper.insert(favorite);
            recipeMapper.update(null, Wrappers.<Recipe>lambdaUpdate()
                    .eq(Recipe::getId, recipeId)
                    .setSql("crowd = crowd + 1"));
        } catch (DuplicateKeyException ignored) {
            // 并发重复收藏，保持幂等
        }
        return new FavoriteResult(true, currentCrowd(recipeId));
    }

    @Transactional
    public FavoriteResult unfavorite(Long recipeId, Long userId) {
        requireRecipe(recipeId);
        int removed = favoriteMapper.delete(Wrappers.<Favorite>lambdaQuery()
                .eq(Favorite::getUserId, userId)
                .eq(Favorite::getRecipeId, recipeId));
        if (removed > 0) {
            recipeMapper.update(null, Wrappers.<Recipe>lambdaUpdate()
                    .eq(Recipe::getId, recipeId)
                    .setSql("crowd = GREATEST(crowd - 1, 0)"));
        }
        return new FavoriteResult(false, currentCrowd(recipeId));
    }

    public Map<Long, User> usersFor(List<RecipeDto> recipes) {
        Set<Long> ids = recipes.stream().map(RecipeDto::authorId).collect(Collectors.toSet());
        if (ids.isEmpty()) {
            return Collections.emptyMap();
        }
        return userMapper.selectBatchIds(ids).stream().collect(Collectors.toMap(User::getId, Function.identity()));
    }

    public User authorOf(Long recipeId) {
        Recipe recipe = requireRecipe(recipeId);
        return userMapper.selectById(recipe.getAuthorId());
    }

    private Recipe requireRecipe(Long id) {
        Recipe recipe = id == null ? null : recipeMapper.selectById(id);
        if (recipe == null) {
            throw ApiException.notFound("这道菜可能已经被端走了。");
        }
        return recipe;
    }

    private int currentCrowd(Long recipeId) {
        Recipe recipe = recipeMapper.selectById(recipeId);
        return recipe == null ? 0 : recipe.getCrowd();
    }

    private List<String> normalizeTags(List<String> rawTags) {
        if (rawTags == null || rawTags.isEmpty()) {
            return List.of();
        }
        Set<String> result = new LinkedHashSet<>();
        for (String raw : rawTags) {
            if (raw == null || raw.isBlank()) {
                continue;
            }
            String value = raw.trim();
            if (!MetaCatalog.TAGS.contains(value)) {
                throw ApiException.badRequest("标签不在可选范围：" + value);
            }
            result.add(value);
        }
        if (result.size() > 3) {
            throw ApiException.badRequest("标签最多选 3 个。");
        }
        return new ArrayList<>(result);
    }

    private List<RecipeDto> toDtos(List<Recipe> recipes) {
        if (recipes == null || recipes.isEmpty()) {
            return List.of();
        }
        List<Long> ids = recipes.stream().map(Recipe::getId).toList();

        Map<Long, List<Ingredient>> ingredientMap = ingredientMapper.selectList(
                        Wrappers.<Ingredient>lambdaQuery().in(Ingredient::getRecipeId, ids)
                                .orderByAsc(Ingredient::getRecipeId).orderByAsc(Ingredient::getSortNo))
                .stream().collect(Collectors.groupingBy(Ingredient::getRecipeId, LinkedHashMap::new, Collectors.toList()));

        Map<Long, List<RecipeStep>> stepMap = stepMapper.selectList(
                        Wrappers.<RecipeStep>lambdaQuery().in(RecipeStep::getRecipeId, ids)
                                .orderByAsc(RecipeStep::getRecipeId).orderByAsc(RecipeStep::getSortNo))
                .stream().collect(Collectors.groupingBy(RecipeStep::getRecipeId, LinkedHashMap::new, Collectors.toList()));

        List<RecipeTag> links = recipeTagMapper.selectList(
                Wrappers.<RecipeTag>lambdaQuery().in(RecipeTag::getRecipeId, ids));
        Set<Long> tagIds = links.stream().map(RecipeTag::getTagId).collect(Collectors.toSet());
        Map<Long, String> tagNames = tagIds.isEmpty() ? Map.of()
                : tagMapper.selectBatchIds(tagIds).stream().collect(Collectors.toMap(Tag::getId, Tag::getName));
        Map<Long, List<String>> recipeTags = new LinkedHashMap<>();
        for (RecipeTag link : links) {
            String name = tagNames.get(link.getTagId());
            if (name != null) {
                recipeTags.computeIfAbsent(link.getRecipeId(), key -> new ArrayList<>()).add(name);
            }
        }

        List<RecipeDto> result = new ArrayList<>(recipes.size());
        for (Recipe recipe : recipes) {
            List<IngredientDto> ingredients = ingredientMap.getOrDefault(recipe.getId(), List.of()).stream()
                    .map(item -> new IngredientDto(item.getName(), item.getAmount()))
                    .toList();
            List<String> steps = stepMap.getOrDefault(recipe.getId(), List.of()).stream()
                    .map(RecipeStep::getContent)
                    .toList();
            result.add(new RecipeDto(
                    recipe.getId(),
                    recipe.getTitle(),
                    recipe.getEmoji(),
                    recipe.getCategory(),
                    recipe.getDescription(),
                    recipe.getAuthorId(),
                    recipe.getCookTime(),
                    recipe.getDifficulty(),
                    recipe.getServings(),
                    List.copyOf(recipeTags.getOrDefault(recipe.getId(), List.of())),
                    ingredients,
                    steps,
                    recipe.getTip(),
                    recipe.getCoverUrl(),
                    recipe.getCrowd(),
                    recipe.getSource(),
                    recipe.getCreatedAt()
            ));
        }
        return result;
    }
}
