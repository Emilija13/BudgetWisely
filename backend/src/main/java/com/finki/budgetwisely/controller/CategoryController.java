package com.finki.budgetwisely.controller;

import com.finki.budgetwisely.model.Category;
import com.finki.budgetwisely.service.CategoryService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
@RequestMapping("/api/categories")
public class CategoryController {
    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    private List<Category> findAll() {
        return this.categoryService.findAll();
    }
}
