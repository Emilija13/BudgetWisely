package com.finki.budgetwisely.service;

import com.finki.budgetwisely.dto.RecurringTransactionDto;
import com.finki.budgetwisely.model.RecurringTransaction;

import java.util.List;
import java.util.Optional;

public interface RecurringTransactionService {
    Optional<RecurringTransaction> editRecurringTransaction(Long id, RecurringTransactionDto dto);

    List<RecurringTransaction> findAll(Long userId);

    RecurringTransaction toggleActiveStatus(Long id, boolean active);

    void deleteById(Long id);

    Optional<RecurringTransaction> findById(Long id);
}
