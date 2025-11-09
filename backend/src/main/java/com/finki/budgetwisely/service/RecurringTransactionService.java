package com.finki.budgetwisely.service;

import com.finki.budgetwisely.dto.RecurringTransactionDto;
import com.finki.budgetwisely.model.RecurringTransaction;

public interface RecurringTransactionService {
    RecurringTransaction editRecurringTransaction(Long id, RecurringTransactionDto dto);
}
