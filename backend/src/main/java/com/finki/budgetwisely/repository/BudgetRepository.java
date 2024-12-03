package com.finki.budgetwisely.repository;

import com.finki.budgetwisely.model.Budget;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BudgetRepository extends JpaRepository<Budget, Long> {
}
