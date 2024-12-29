package com.finki.budgetwisely.repository;

import com.finki.budgetwisely.model.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {

    @Query("SELECT b FROM Budget b " +
            "WHERE b.user.id = :user " +
            "AND b.category.id = :category " +
            "AND b.yearMonth = :yearMonth")
    Optional<Budget> findByUserAndCategoryAndYearMonth(Long user, Long category, LocalDate yearMonth);

    @Query("SELECT b FROM Budget b " +
            "WHERE b.user.id = :user " +
            "AND b.yearMonth = :yearMonth")
    List<Budget> findByUserAndYearMonth(Long user, LocalDate yearMonth);


    List<Budget> findAllByUserId(Long user);

    List<Budget> findByYearMonth(LocalDate yearMonth);

    @Query("SELECT b FROM Budget b " +
            "WHERE b.user.id = :userId " +
            "AND b.yearMonth = :yearMonth " +
            "ORDER BY b.leftover ASC " +
            "LIMIT 3")
    List<Budget> findByUserAndYearMonthLast(@Param("userId")Long userId, @Param("yearMonth")LocalDate yearMonth);
}
