package com.finki.budgetwisely.service;

import com.finki.budgetwisely.model.Category;

import java.util.List;
import java.util.Optional;

public interface CategoryService {
    List<Category> findAll();
    Optional<Category> findById(Long id);
}
