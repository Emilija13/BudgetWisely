package com.finki.budgetwisely.service.impl;

import com.finki.budgetwisely.dto.RecurringTransactionDto;
import com.finki.budgetwisely.exceptions.AccountNotFoundException;
import com.finki.budgetwisely.exceptions.CategoryNotFoundException;
import com.finki.budgetwisely.exceptions.RecurringTransactionNotFoundException;
import com.finki.budgetwisely.model.Account;
import com.finki.budgetwisely.model.Category;
import com.finki.budgetwisely.model.RecurringTransaction;
import com.finki.budgetwisely.repository.AccountRepository;
import com.finki.budgetwisely.repository.CategoryRepository;
import com.finki.budgetwisely.repository.RecurringTransactionRepository;
import com.finki.budgetwisely.service.RecurringTransactionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RecurringTransactionServiceImpl implements RecurringTransactionService {

    private final RecurringTransactionRepository recurringTransactionRepository;
    private final CategoryRepository categoryRepository;
    private final AccountRepository accountRepository;

    public RecurringTransactionServiceImpl(
            RecurringTransactionRepository recurringTransactionRepository,
            CategoryRepository categoryRepository,
            AccountRepository accountRepository) {
        this.recurringTransactionRepository = recurringTransactionRepository;
        this.categoryRepository = categoryRepository;
        this.accountRepository = accountRepository;
    }

    @Transactional
    public RecurringTransaction editRecurringTransaction(
            Long id,
            RecurringTransactionDto dto
    ) {
        RecurringTransaction recurring = recurringTransactionRepository.findById(id)
                .orElseThrow(() -> new RecurringTransactionNotFoundException(id));

        recurring.setName(dto.getName());
        recurring.setCost(dto.getCost());
        recurring.setType(dto.getType());
        recurring.setFrequency(dto.getFrequency());
        recurring.setDayOfMonth(dto.getDayOfMonth());
        recurring.setDayOfWeek(dto.getDayOfWeek());
        recurring.setStartDate(dto.getStartDate());
        recurring.setEndDate(dto.getEndDate());
        recurring.setIsActive(dto.getIsActive());

        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new CategoryNotFoundException(dto.getCategoryId()));
            recurring.setCategory(category);
        }
        if (dto.getAccountId() != null) {
            Account account = accountRepository.findById(dto.getAccountId())
                    .orElseThrow(() -> new AccountNotFoundException(dto.getAccountId()));
            recurring.setAccount(account);
        }

        return recurringTransactionRepository.save(recurring);
    }
}
