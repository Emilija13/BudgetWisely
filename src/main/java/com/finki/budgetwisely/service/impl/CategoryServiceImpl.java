package com.finki.budgetwisely.service.impl;

import com.finki.budgetwisely.model.Category;
import com.finki.budgetwisely.repository.CategoryRepository;
import com.finki.budgetwisely.service.CategoryService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<Category> findAll() {
        return categoryRepository.findAll();
    }
}
