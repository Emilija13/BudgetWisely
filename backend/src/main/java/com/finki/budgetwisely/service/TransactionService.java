package com.finki.budgetwisely.service;

import com.finki.budgetwisely.dto.FilterDto;
import com.finki.budgetwisely.dto.FilteredTransactionsDto;
import com.finki.budgetwisely.dto.TransactionRequestDto;
import com.finki.budgetwisely.model.Transaction;
import java.util.List;
import java.util.Optional;

public interface TransactionService {
    List<Transaction> findAll();

    FilteredTransactionsDto filter(FilterDto filterDto);

    List<Transaction> findAll(Long userId);

    Optional<Transaction> findById(Long id);

    Optional<Transaction> save(TransactionRequestDto transactionDto);

    Optional<Transaction> edit(Long id, TransactionRequestDto transactionDto);

    void deleteById(Long id);

    List<Transaction> getLastTransactions(Long user);
}
