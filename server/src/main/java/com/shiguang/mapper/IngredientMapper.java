package com.shiguang.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.shiguang.domain.Ingredient;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface IngredientMapper extends BaseMapper<Ingredient> {
}
