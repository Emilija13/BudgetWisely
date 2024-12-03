package com.finki.budgetwisely.repository;

import com.finki.budgetwisely.model.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {

    @Query("SELECT b FROM Budget b " +
            "WHERE b.user.id = :user " +
            "AND b.category.id = :category " +
            "AND b.yearMonth = :yearMonth")
    Optional<Budget> findByUserAndCategoryAndYearMonth(Long user, Long category, LocalDate yearMonth);
}
