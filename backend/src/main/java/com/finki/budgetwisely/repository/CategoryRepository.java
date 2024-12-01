package com.finki.budgetwisely.repository;

import com.finki.budgetwisely.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
