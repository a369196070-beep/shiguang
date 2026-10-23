package com.shiguang.web;

import com.shiguang.dto.CategoryDto;
import com.shiguang.dto.DemoAccountDto;
import com.shiguang.meta.MetaCatalog;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/meta")
public class MetaController {
    public record MetaResponse(List<CategoryDto> categories, List<String> tags, List<String> difficulties,
                               DemoAccountDto demoAccount) {
    }

    @GetMapping
    public MetaResponse meta() {
        return new MetaResponse(MetaCatalog.CATEGORIES, MetaCatalog.TAGS, MetaCatalog.DIFFICULTIES, MetaCatalog.DEMO_ACCOUNT);
    }
}
