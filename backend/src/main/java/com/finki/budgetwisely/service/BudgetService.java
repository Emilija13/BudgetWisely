package com.finki.budgetwisely.service;

import com.finki.budgetwisely.dto.BudgetRequestDto;
import com.finki.budgetwisely.dto.TransactionRequestDto;
import com.finki.budgetwisely.model.Budget;
import com.finki.budgetwisely.model.Transaction;

import java.util.List;
import java.util.Optional;

public interface BudgetService {
    List<Budget> findAll();

    List<Budget> findAllCurrent(Long userId);

    Optional<Budget> findById(Long id);

    Optional<Budget> save(BudgetRequestDto budgetDto);

    Optional<Budget> edit(Long id, BudgetRequestDto budgetDto);

    void deleteById(Long id);
}
